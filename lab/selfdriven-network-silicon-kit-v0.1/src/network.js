'use strict';
/*
 * selfdriven.network Silicon Kit v0.1 demonstration bridge.
 * Models LOCAL policy decisions only; NOT a public selfdriven.network API.
 * Avoids claiming sensor correctness, verified ownership or hardware attestation.
 */
const crypto = require('node:crypto');
const { verifyChain, canonicalize, verifyEvent } = require('./silicon-protocol');
const BRIDGE = 'selfdriven.network.silicon.bridge.v0.1';
const ID = /^community:[a-z0-9][a-z0-9-]{1,62}$/;
const HASH = /^sha256:[a-f0-9]{64}$/;
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function policyDecision(event, registry, policy) {
  if (!registry || !Array.isArray(registry.devices)) return { status: 'unassessed', reason: 'No device registry provided' };
  if (!policy || !Array.isArray(policy.allowedEvidenceTypes) || !ID.test(policy.communityId || '')) return { status: 'unassessed', reason: 'No valid community policy provided' };
  const entries = registry.devices.filter(d => d.deviceId === event.deviceId && d.communityId === policy.communityId);
  if (entries.length !== 1) return { status: 'denied', reason: 'Device not uniquely enrolled in this community' };
  const device = entries[0];
  if (device.publicKeySpki !== event.proof.publicKeySpki) return { status: 'denied', reason: 'Registry public key mismatch' };
  if (device.status !== 'active') return { status: 'denied', reason: 'Device suspended or revoked' };
  if (!policy.allowedEvidenceTypes.includes(event.evidenceType)) return { status: 'denied', reason: 'Community policy denies evidence type' };
  if (!Array.isArray(device.allowedEvidenceTypes) || !device.allowedEvidenceTypes.includes(event.evidenceType)) return { status: 'denied', reason: 'Device not authorised for evidence type' };
  if (device.assurance !== 'software-demo') return { status: 'denied', reason: 'This demonstrator only accepts explicitly marked software-demo devices' };
  return { status: 'locally-permitted', communityId: policy.communityId, assurance: device.assurance };
}

function verifyBundle(events, registry, policy) {
  const cryptographic = verifyChain(events);
  if (!cryptographic.valid) return { status: 'rejected', cryptographic, community: { status: 'not-checked' } };
  const results = events.map(event => policyDecision(event, registry, policy));
  const denied = results.find(r => r.status === 'denied');
  const unknown = results.find(r => r.status === 'unassessed');
  const community = denied || unknown || results[0];
  return { status: community.status === 'locally-permitted' ? 'accepted-demo' : 'rejected', cryptographic, community };
}

function projectGraph(event, communityId) {
  const v = verifyEvent(event);
  if (!v.valid) throw Error('Invalid evidence: ' + v.reason);
  if (!ID.test(communityId)) throw Error('Invalid communityId');
  const evidenceId = `evidence:${event.proof.eventHash}`;
  const deviceId = event.deviceId;
  const observation = { ...event.observation };
  return {
    format: 'selfdriven.network.vcg-projection.v0.1',
    status: 'proposed-uncommitted',
    communityId,
    nodes: [
      { id: communityId, type: 'Community' },
      { id: deviceId, type: 'DeviceIdentity', assurance: 'software-demo' },
      { id: evidenceId, type: 'SignedObservation', observedAt: event.observedAt, evidenceType: event.evidenceType, observation, sourceEventHash: event.proof.eventHash }
    ],
    edges: [
      { from: deviceId, relation: 'listedByLocalRegistry', to: communityId },
      { from: deviceId, relation: 'signed', to: evidenceId }
    ],
    caveats: ['This projection is not independently verified context', 'No sensor calibration, trusted clock or hardware attestation']
  };
}

function anchorManifest(events, communityId) {
  if (!ID.test(communityId)) throw Error('Invalid communityId');
  const v = verifyChain(events);
  if (!v.valid) throw Error('Cannot anchor invalid event chain: ' + v.reason);
  const hashes = events.map(e => e.proof.eventHash);
  if (!hashes.every(h => HASH.test(h))) throw Error('Invalid event hashes');
  const payload = { domain: 'selfdriven.network.silicon.anchor.v0.1', communityId, hashes };
  return {
    format: 'selfdriven.network.anchor-manifest.v0.1', communityId,
    evidenceCount: hashes.length,
    evidenceHead: v.head,
    digest: `sha256:${sha256(Buffer.from(canonicalize(payload), 'utf8'))}`,
    chain: 'none', status: 'not-submitted',
    note: 'Local digest only. No Cardano transaction or consensus finality.'
  };
}
function verifyManifest(events, manifest) {
  try {
    const computed = anchorManifest(events, manifest.communityId);
    return computed.digest === manifest.digest && computed.evidenceHead === manifest.evidenceHead && computed.evidenceCount === manifest.evidenceCount;
  } catch (_) { return false; }
}

function interfaceProposal(event, communityId) {
  // This is a proposed integration envelope, NOT a supported API method.
  return {
    proposal: BRIDGE,
    interface: 'Infra -> Entity/Core / SSI / Attachment / AI / OnChain',
    transport: 'local-mock-only',
    method: 'ingest-signed-evidence',
    data: { communityId, event },
    productionApiCompatibility: 'not-established'
  };
}
module.exports = { BRIDGE, policyDecision, verifyBundle, projectGraph, anchorManifest, verifyManifest, interfaceProposal };
