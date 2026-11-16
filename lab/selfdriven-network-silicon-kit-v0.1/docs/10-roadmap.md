# 10 — Roadmap, success criteria and decision gates

## Phase 0 — Kit validation (provided)

**Deliverable:** a local, repeatable signature/registry/policy demonstration, proposed context graph and offline anchor manifest. **Proof:** automated tests and reproducible example generation. **Caveat:** software-only, locally controlled trust inputs.

## Phase 1 — Network interface alignment

**Target:** agree with interface maintainers on how an enrolled physical device is represented. Specify data ownership, schema, keys, versioned field naming, permission checks and where context graphs live. Select explicit APIs rather than adding undefined methods to production endpoints.

**Gate:** a reviewed interface contract, independent implementation and operational data-retention agreement.

## Phase 2 — Protected hardware pilot

**Target:** one community-owned device and protected key backed by an evaluated secure element, plus at least one independently validated sensor or test signal.

**Gate:** documented provisioning, recovery, remote attestation (if supported), software update, revocation and field-test traceability.

## Phase 3 — Community-operated node

**Target:** durable store-and-forward, independent verifier replicas, signed policy/registry, monitoring and human governance. Avoid systemic reliance on a single central oracle.

**Gate:** tests for loss of connectivity, replay across restarts, key rotation, compromised host, mistaken attribution and transparent dispute resolution.

## Phase 4 — Optional public commitment

**Target:** Cardano anchor for selected batches, after privacy and data value are justified. Define finality and audit evidence.

**Gate:** independent on-chain inclusion verification, fee/custody budget, privacy review and legal assessment for consequences.

## Phase 5 — Open ASIC exploration

**Target:** evaluate PDK, security IP, design verification, fabrication access, packaging, lifecycle and costs. May never be necessary.

**Gate:** clear value over commodity trusted hardware; independent security and economic review.

## MVP acceptance checklist

- [x] Every signed event is independently verifiable offline.
- [x] Tampering and out-of-order chains fail.
- [x] Revocation in local policy blocks new local approval.
- [x] A context-graph projection expresses provenance and uncertainty.
- [x] A local manifest can be independently checked; it claims no chain submission.
- [x] Local HTTP mock rejects duplicate hashes within one process.
- [ ] Registry and policy are governed and cryptographically authenticated.
- [ ] A real secure element is connected with independently verified attestation.
- [ ] A real sensor has appropriate calibration/corroboration.
- [ ] Interfaces Node production integration is reviewed and implemented.
- [ ] Distributed persistence, privacy and incident management have been tested.

## Candidate first six-week pilot

| Week | Milestone | Evidence produced |
|---|---|---|
| 1 | Community use case and 5W1H decisions | Scope, risks, authority model |
| 2 | Review event schema + integration mapping | Contract draft and test vectors |
| 3 | Select host and secure-element kit | Hardware assessment and BOM |
| 4 | Provision and sign with protected key | Verification run and key lifecycle record |
| 5 | Add real sensor + policy lifecycle | Calibrated/corroborated test record |
| 6 | Independent audit + pilot decision | Findings, go/no-go and next backlog |

This is a planning template, not a delivery schedule or guaranteed integration estimate.
