'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { PROTOCOL, generateSoftwareSigner, createSignedEvent } = require('./silicon-protocol');
const { verifyBundle, projectGraph, anchorManifest, interfaceProposal } = require('./network');

function generate() {
  const signer = generateSoftwareSigner();
  const communityId = 'community:solar-commons';
  const policy = {
    version: 'selfdriven.network.local-policy.v0.1', communityId,
    allowedEvidenceTypes: ['energy.production.sample'],
    note: 'Illustrative local-only community policy; not signed or independently governed.'
  };
  const registry = {
    version: 'selfdriven.network.local-registry.v0.1',
    note: 'Illustrative allowlist. Not trusted attestation, ownership or credential issuance.',
    devices: [{ communityId, deviceId: signer.deviceId, publicKeySpki: signer.publicKeySpki,
      status: 'active', assurance: 'software-demo', allowedEvidenceTypes: ['energy.production.sample'] }]
  };
  let previousHash = null;
  const base = Date.parse('2026-11-16T06:00:00.000Z');
  const events = [1200, 1260, 1320].map((wattHours, i) => {
    const e = createSignedEvent({ protocol: PROTOCOL, deviceId: signer.deviceId, sequence: i + 1,
      previousHash, observedAt: new Date(base + i * 60000).toISOString(), evidenceType: 'energy.production.sample',
      observation: { sourceId: 'simulated-community-meter', wattHours, intervalSeconds: 60 }
    }, signer);
    previousHash = e.proof.eventHash;
    return e;
  });
  const verification = verifyBundle(events, registry, policy);
  if (verification.status !== 'accepted-demo') throw Error('Demo verification failed');
  return { events, registry, policy, verification, graph: projectGraph(events[2], communityId),
    manifest: anchorManifest(events, communityId), proposal: interfaceProposal(events[2], communityId) };
}
function main() {
  const d = generate();
  const out = path.join(__dirname, '..', 'examples');
  fs.mkdirSync(out, { recursive: true });
  const items = {
    'evidence.json': { events: d.events },
    'community-registry.json': d.registry,
    'community-policy.json': d.policy,
    'vcg-projection.json': d.graph,
    'anchor-manifest.json': d.manifest,
    'proposed-interface-message.json': d.proposal
  };
  Object.entries(items).forEach(([name, item]) => fs.writeFileSync(path.join(out, name), JSON.stringify(item, null, 2) + '\n'));
  console.log(`PASS: signed ${d.events.length} simulated readings and validated a local community policy`);
  console.log(`Device: ${d.events[0].deviceId}`);
  console.log(`Community: ${d.policy.communityId}`);
  console.log(`Manifest: ${d.manifest.digest} (NOT on-chain)`);
  console.log('Examples written. Keys were ephemeral and have not been stored.');
  console.log('No physical hardware, on-chain submission, or live selfdriven.network API was contacted.');
}
if (require.main === module) Promise.resolve().then(main).catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { generate };
