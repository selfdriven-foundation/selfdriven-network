# 09 — Hands-on learning labs

## Lab 1 — First simulated community node (20 minutes)

Run `npm run demo`. Read the generated `examples/evidence.json`. Identify `deviceId`, sequence, hash, signature, energy reading and `observedAt`. Observe that keys are not saved, the readings are synthetic and every new run creates a new identity.

**Outcome:** explain why a signed event is different from a verified physical measurement.

## Lab 2 — Independent verification (15 minutes)

Run `npm run verify`. In a copy of `examples/evidence.json`, change one `wattHours` field; run `node src/verify.js <changed-file> ...`. The signature must fail. Restore and reorder events; the hash chain must fail.

**Outcome:** separate byte integrity from sequencing integrity.

## Lab 3 — Community autonomy (15 minutes)

Change `status` in `examples/community-registry.json` from `active` to `revoked`. Run verify again. The cryptographic chain should still pass, while community permission is denied.

**Outcome:** governance can change an authorisation without changing past cryptographic facts.

## Lab 4 — Network context (20 minutes)

Read `examples/vcg-projection.json`. Identify Community, DeviceIdentity and SignedObservation nodes and their relationships. Propose an additional attachment or issuer credential, keeping provenance and uncertainty explicit.

**Outcome:** distinguish a graph projection from an authoritative community fact.

## Lab 5 — Local API bridge and replay (20 minutes)

Run `npm run serve`. POST the example bundle to `/demo/ingest` using the README command. Send it again: the server rejects duplicate event hashes in memory. Restart the server and repeat: replay state is reset, exposing the need for persistent distributed replay protection.

**Outcome:** understand the difference between a local mock and a production Interfaces Node endpoint.

## Lab 6 — A Cardano commitment without a transaction (20 minutes)

Open `examples/anchor-manifest.json`. Explain `status: not-submitted`, the ordered event hash digest and what would be required for actual inclusion and confirmation. Never infer chain finality from local output.

**Outcome:** describe the narrow role of public anchoring.

## Lab 7 — Read the hardware path (45–60 minutes)

Open `rtl/event_counter.sv`. Simulate with a suitable SystemVerilog simulator if available, such as Icarus Verilog. Explain why a digital event counter does not provide secure key custody, randomness, side-channel resistance, firmware attestation or sensor integrity.

**Outcome:** understand how a PDK relates to physical fabrication without confusing educational RTL with a finished secure chip.

## Lab 8 — Community deployment design workshop (60 minutes)

Define a real asset, trusted measurement source, operators, revocation policy, privacy boundaries, evidence retention, safety fallback and review process. Record five decisions and three unresolved risks. Do not connect live assets until all gates are met.

**Outcome:** a governance-aware pilot design, not just a working signing function.
