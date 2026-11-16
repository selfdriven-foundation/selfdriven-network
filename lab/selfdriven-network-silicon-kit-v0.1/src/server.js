'use strict';
const http = require('node:http');
const { verifyBundle, projectGraph } = require('./network');
const MAX_BYTES = 1_000_000;
const parseBody = async req => {
  let body = '';
  for await (const part of req) {
    body += part;
    if (Buffer.byteLength(body) > MAX_BYTES) throw Error('Payload too large');
  }
  return JSON.parse(body || '{}');
};
function createDemoServer() {
  const seen = new Set();
  return http.createServer((req, res) => {
    const reply = (status, obj) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)); };
    if (req.method === 'GET' && req.url === '/health') return reply(200, { status: 'OK', mode: 'localhost-demo-only' });
    if (req.method !== 'POST' || req.url !== '/demo/ingest') return reply(404, { status: 'ER', error: 'Route not found' });
    parseBody(req).then(payload => {
      const { events, registry, policy } = payload;
      const v = verifyBundle(events, registry, policy);
      if (v.status !== 'accepted-demo') return reply(422, { status: 'ER', verification: v });
      const hashes = events.map(e => e.proof.eventHash);
      if (hashes.some(hash => seen.has(hash))) return reply(409, { status: 'ER', error: 'Replay: evidence already submitted in this process' });
      hashes.forEach(hash => seen.add(hash));
      return reply(200, { status: 'OK', mode: 'mock', verification: v,
        projection: projectGraph(events[events.length - 1], policy.communityId), recorded: hashes.length });
    }).catch(e => reply(400, { status: 'ER', error: e.message }));
  });
}
if (require.main === module) {
  createDemoServer().listen(8790, '127.0.0.1', () => console.log('Local mock API at http://127.0.0.1:8790 (NOT production)'));
}
module.exports = { createDemoServer };
