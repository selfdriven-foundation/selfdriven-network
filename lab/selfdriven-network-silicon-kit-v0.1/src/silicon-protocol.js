'use strict';

/**
 * selfdriven Silicon Kit v0.1: minimal, educational signed-evidence profile.
 * Only built-in Node.js crypto is used. This is NOT a security-audited library.
 * Canonicalisation is deliberately narrow; it is NOT RFC 8785 JCS.
 */
const crypto = require('node:crypto');
const PROTOCOL = 'selfdriven.silicon.evidence.v0.1';
const DOMAIN = `${PROTOCOL}\n`;
const FIELDS = ['deviceId', 'evidenceType', 'observation', 'observedAt', 'previousHash', 'protocol', 'sequence'];
const PROOF_FIELDS = ['algorithm', 'eventHash', 'publicKeySpki', 'signature', 'signerType'];

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v) &&
    (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
}
function exactlyFields(obj, required) {
  return isPlainObject(obj) && Object.keys(obj).sort().join('|') === required.slice().sort().join('|');
}
function canonicalize(v) {
  if (v === null) return 'null';
  if (typeof v === 'string' || typeof v === 'boolean') return JSON.stringify(v);
  if (typeof v === 'number' && Number.isSafeInteger(v) && !Object.is(v, -0)) return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonicalize).join(',')}]`;
  if (isPlainObject(v)) {
    const keys = Object.keys(v).sort();
    // Limit the profile to ASCII field names; string values may be Unicode.
    if (keys.some(k => !/^[A-Za-z][A-Za-z0-9_]*$/.test(k))) {
      throw Error('Only ASCII alphanumeric/underscore object keys are supported');
    }
    return `{${keys.map(k => `${JSON.stringify(k)}:${canonicalize(v[k])}`).join(',')}}`;
  }
  throw Error('Unsupported canonical value; only JSON values with safe integer numbers');
}
function sha256(b) { return crypto.createHash('sha256').update(b).digest(); }
function b64url(b) { return Buffer.from(b).toString('base64url'); }
function derFromKey(publicKey) { return publicKey.export({ format: 'der', type: 'spki' }); }
function makeDeviceId(publicKeySpki) {
  const der = Buffer.from(publicKeySpki, 'base64url');
  return `sdid:spki256:${b64url(sha256(der))}`;
}
function validateBody(body) {
  if (!exactlyFields(body, FIELDS)) throw Error('Invalid body fields');
  if (body.protocol !== PROTOCOL) throw Error('Unsupported protocol');
  if (typeof body.deviceId !== 'string' || !/^sdid:spki256:[a-zA-Z0-9_-]{43}$/.test(body.deviceId)) throw Error('Invalid deviceId');
  if (!Number.isSafeInteger(body.sequence) || body.sequence < 1) throw Error('Invalid sequence');
  if (body.previousHash !== null && (typeof body.previousHash !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(body.previousHash))) throw Error('Invalid previousHash');
  if (body.sequence === 1 && body.previousHash !== null) throw Error('First event cannot have previousHash');
  if (typeof body.observedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(body.observedAt) || Number.isNaN(Date.parse(body.observedAt))) throw Error('Invalid observedAt');
  if (body.evidenceType !== 'energy.production.sample') throw Error('Only energy.production.sample is implemented in v0.1 demo');
  const obs = body.observation;
  if (!exactlyFields(obs, ['sourceId', 'wattHours', 'intervalSeconds'])) throw Error('Invalid observation fields');
  if (typeof obs.sourceId !== 'string' || obs.sourceId.length < 1 || obs.sourceId.length > 100) throw Error('Invalid sourceId');
  if (!Number.isSafeInteger(obs.wattHours) || obs.wattHours < 0) throw Error('Invalid wattHours');
  if (!Number.isSafeInteger(obs.intervalSeconds) || obs.intervalSeconds <= 0) throw Error('Invalid intervalSeconds');
  canonicalize(body); // Full data-type validation.
}
function preimage(body) {
  validateBody(body);
  return Buffer.from(DOMAIN + canonicalize(body), 'utf8');
}
function generateSoftwareSigner() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const publicKeySpki = b64url(derFromKey(publicKey));
  return {
    publicKeySpki,
    deviceId: makeDeviceId(publicKeySpki),
    signerType: 'software-demo',
    sign(message) { return crypto.sign(null, message, privateKey); }
  }; // privateKey never serialized; new ephemeral identity each run.
}
function createSignedEvent(body, signer) {
  if (body.deviceId !== signer.deviceId) throw Error('Device identity does not match signer');
  const message = preimage(body);
  const eventHash = `sha256:${sha256(message).toString('hex')}`;
  const signature = b64url(signer.sign(message));
  return { ...body, proof: {
    algorithm: 'Ed25519', eventHash, publicKeySpki: signer.publicKeySpki,
    signature, signerType: signer.signerType
  }};
}
function verifyEvent(event) {
  try {
    if (!isPlainObject(event) || !exactlyFields(event, [...FIELDS, 'proof'])) throw Error('Invalid event fields');
    if (!exactlyFields(event.proof, PROOF_FIELDS)) throw Error('Invalid proof fields');
    const { proof, ...body } = event;
    if (proof.algorithm !== 'Ed25519' || proof.signerType !== 'software-demo') throw Error('Unsupported proof metadata');
    if (!/^[A-Za-z0-9_-]+$/.test(proof.publicKeySpki) || !/^[A-Za-z0-9_-]+$/.test(proof.signature)) throw Error('Invalid base64url proof');
    if (makeDeviceId(proof.publicKeySpki) !== body.deviceId) throw Error('Public key does not match deviceId');
    const key = crypto.createPublicKey({ key: Buffer.from(proof.publicKeySpki, 'base64url'), format: 'der', type: 'spki' });
    if (key.asymmetricKeyType !== 'ed25519' || b64url(derFromKey(key)) !== proof.publicKeySpki) throw Error('Invalid Ed25519 public key');
    const msg = preimage(body);
    if (proof.eventHash !== `sha256:${sha256(msg).toString('hex')}`) throw Error('Event hash mismatch');
    if (!crypto.verify(null, msg, key, Buffer.from(proof.signature, 'base64url'))) throw Error('Signature invalid');
    return { valid: true, eventHash: proof.eventHash, deviceId: body.deviceId };
  } catch (err) { return { valid: false, reason: err.message }; }
}
function verifyChain(events) {
  if (!Array.isArray(events) || events.length === 0) return { valid: false, reason: 'No events' };
  let previous = null;
  let device = null;
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const v = verifyEvent(e);
    if (!v.valid) return { valid: false, index: i, reason: v.reason };
    if (device === null) device = e.deviceId;
    if (e.deviceId !== device) return { valid: false, index: i, reason: 'Multiple devices in one sequence' };
    if (e.sequence !== i + 1) return { valid: false, index: i, reason: 'Sequence gap or reorder' };
    if (e.previousHash !== previous) return { valid: false, index: i, reason: 'Broken hash chain' };
    previous = e.proof.eventHash;
  }
  return { valid: true, count: events.length, deviceId: device, head: previous };
}
function checkRegistry(events, registry) {
  if (!registry || !Array.isArray(registry.devices)) return { status: 'unassessed', reason: 'No independent registry supplied' };
  const device = events[0]?.deviceId;
  const entries = registry.devices.filter(x => x.deviceId === device);
  if (entries.length !== 1) return { status: 'untrusted', reason: 'Device missing or duplicated in registry' };
  const d = entries[0];
  if (d.status !== 'active') return { status: 'untrusted', reason: 'Device not active' };
  if (d.publicKeySpki !== events[0].proof.publicKeySpki) return { status: 'untrusted', reason: 'Registry key mismatch' };
  return { status: 'locally-listed', assurance: d.assurance || 'unknown', note: 'This demo registry is unsigned; listing is NOT hardware attestation.' };
}
module.exports = { PROTOCOL, canonicalize, generateSoftwareSigner, createSignedEvent, verifyEvent, verifyChain, checkRegistry, makeDeviceId };
