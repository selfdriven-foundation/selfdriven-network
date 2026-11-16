# 05 — Evidence profile and Verified Context Graph proposal

## Inherited signed-event protocol

This kit deliberately retains the earlier educational `selfdriven.silicon.evidence.v0.1` format so network adapters can be explored without redefining cryptography. Each event includes:

- A public-key-derived **device ID** (not an asserted human identity).
- A monotonic **sequence** and `previousHash` pointing to the prior event.
- An ISO timestamp supplied by the untrusted host clock.
- A single supported educational type `energy.production.sample`.
- `observation` values: source ID, watt-hours and interval seconds.
- A `proof` with public key, Ed25519 signature and SHA-256 event hash.

The event is signed over `"selfdriven.silicon.evidence.v0.1\n"` plus a narrow deterministic JSON encoding (alphabetically sorted ASCII object keys, safe integer numbers). This is **not RFC 8785 JCS**, not a broad interoperability claim, and is intentionally insufficient for production standardisation.

## Verification sequence

1. Reject extra or missing keys and unsupported field types.
2. Check protocol prefix and key-derived device identity.
3. Recompute canonical bytes and SHA-256 event hash.
4. Verify Ed25519 over the same exact bytes.
5. Check event sequence and previous-hash linkage.
6. Evaluate **separate** community registry and policy.
7. Record whether attestation, calibration and trusted time were independently established. Here they were not.
8. Generate a graph projection only after success; do not automatically publish it.

## A minimal context graph proposal

```text
[community:solar-commons]        [sdid:spki256:...]
          ^                                |
          | listedByLocalRegistry          | signed
          |                                v
          +---------------------- [evidence:sha256:...]
                                      |
                                  observation
                                      |
                         simulated energy counter
```

The JSON proposal in `examples/vcg-projection.json` includes nodes and edges with an explicit `proposed-uncommitted` status and caveats. It does not imply that a production VCG schema or authoritative context record exists. A live integration would map these concepts into the actual Entity/Core and SSI models and record the verification policy version.

## Evidence confidence vocabulary

**signed:** signature checks. **locally-permitted:** unsigned local registry and policy accept it. **hardware-attested:** independently verified hardware/firmware chain, not in v0.1. **physically-corroborated:** external checks of real-world facts, not in v0.1. **context-validated:** a community-approved model of what the evidence means. **decision-authorised:** a separate action approval, not supplied by the evidence itself.

## Storage and privacy

The default sample is public, simulated, and contains no personal measurements. A real deployment should encrypt sensitive attachments, minimise device linkability, define retention periods, validate data ownership and attach machine-readable access restrictions. Avoid storing raw sensor streams or personal identity data on a public blockchain merely because an event is signed.
