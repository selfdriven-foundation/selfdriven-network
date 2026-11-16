'use strict';
const fs = require('node:fs');
const { verifyBundle, anchorManifest, verifyManifest } = require('./network');
function main() {
  const [evidenceFile, registryFile, policyFile, manifestFile] = process.argv.slice(2);
  if (!evidenceFile) throw Error('Usage: node src/verify.js evidence.json [registry.json] [policy.json] [manifest.json]');
  const read = f => f ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
  const events = read(evidenceFile).events;
  const decision = verifyBundle(events, read(registryFile), read(policyFile));
  console.log(JSON.stringify(decision, null, 2));
  if (decision.status !== 'accepted-demo') process.exitCode = 1;
  if (manifestFile) {
    const verified = verifyManifest(events, read(manifestFile));
    console.log('Local anchor manifest matches evidence:', verified);
    if (!verified) process.exitCode = 1;
  }
  console.log('Reminder: local permission, real measurement truth, hardware attestation, and network API integration remain unproven.');
}
Promise.resolve().then(main).catch(err => { console.error(err.message); process.exitCode = 1; });
