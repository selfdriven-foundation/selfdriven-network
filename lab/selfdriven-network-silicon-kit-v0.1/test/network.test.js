'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { generate } = require('../src/demo');
const { verifyEvent, verifyChain } = require('../src/silicon-protocol');
const { verifyBundle, projectGraph, anchorManifest, verifyManifest } = require('../src/network');
const { createDemoServer } = require('../src/server');

test('demo has valid signatures and a valid chain', () => { const d = generate(); assert.equal(verifyChain(d.events).valid, true); });
test('community policy accepts only approved simulated device', () => { const d = generate(); assert.equal(verifyBundle(d.events, d.registry, d.policy).status, 'accepted-demo'); });
test('observation modification is rejected', () => { const d = generate(); const bad = structuredClone(d.events); bad[0].observation.wattHours = 9999; assert.equal(verifyEvent(bad[0]).valid, false); assert.equal(verifyBundle(bad, d.registry, d.policy).status, 'rejected'); });
test('reordered observations fail', () => { const d = generate(); assert.equal(verifyBundle(d.events.slice().reverse(), d.registry, d.policy).status, 'rejected'); });
test('revocation blocks local approval but not signature correctness', () => { const d = generate(); d.registry.devices[0].status = 'revoked'; assert.equal(verifyChain(d.events).valid, true); assert.equal(verifyBundle(d.events, d.registry, d.policy).community.status, 'denied'); });
test('foreign community is denied', () => { const d = generate(); d.policy.communityId = 'community:another-group'; assert.equal(verifyBundle(d.events, d.registry, d.policy).status, 'rejected'); });
test('disallowed evidence type is denied', () => { const d = generate(); d.policy.allowedEvidenceTypes = []; assert.equal(verifyBundle(d.events, d.registry, d.policy).status, 'rejected'); });
test('unassessed without registry is not approved', () => { const d = generate(); assert.equal(verifyBundle(d.events, null, d.policy).status, 'rejected'); });
test('manifest digest checks out', () => { const d = generate(); assert.equal(verifyManifest(d.events, d.manifest), true); assert.equal(verifyManifest(d.events.slice(0,2), d.manifest), false); assert.equal(d.manifest.status, 'not-submitted'); });
test('graph is explicit proposed projection', () => { const d = generate(); const graph = projectGraph(d.events[2], d.policy.communityId); assert.equal(graph.status, 'proposed-uncommitted'); assert.equal(graph.nodes[2].type, 'SignedObservation'); });
test('local mock accepts and rejects replay', async () => {
  const srv = createDemoServer();
  await new Promise(resolve => srv.listen(0, '127.0.0.1', resolve));
  try {
    const { port } = srv.address();
    const d = generate();
    const payload = JSON.stringify({ events: d.events, registry: d.registry, policy: d.policy });
    const go = () => fetch(`http://127.0.0.1:${port}/demo/ingest`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload });
    const first = await go();
    assert.equal(first.status, 200);
    assert.equal((await first.json()).status, 'OK');
    assert.equal((await go()).status, 409);
  } finally { await new Promise(resolve => srv.close(resolve)); }
});
