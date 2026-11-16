# 08 — Threat model, safety and privacy

## What must be protected

Device signing keys; community authorisation decisions; recorded observation integrity; operator privacy; evidence storage; update and revocation pathways; any permission to operate physical assets; and the availability of the Interfaces Node.

## Threats and candidate mitigations

| Threat | What goes wrong | Mitigation / design gate |
|---|---|---|
| Compromised host | Host signs false observations using available signer | Authenticated sensor, strict signer policy, firmware measurement and corroboration |
| Forged registry | Attacker adds their device to allowlist | Signed issuer-approved policy, robust access control and audit trail |
| Key theft | Counterfeit device signs events | Non-exportable keys, provisioning controls, revocation and detection |
| Replay | Old events accepted as new activity | Persistent dedupe, sequence windows, challenge-response and epoch markers |
| Counter reset | New chain masks gaps | Trusted counter or signed reset/rotation event, continuity policy |
| Fake time | Host lies about measurement timestamp | Trusted time or external timestamp attestation where necessary |
| Malicious sensor | Perfectly signed wrong physical data | Calibration, independent comparison, provenance and audits |
| Public correlation | Device history reveals private behaviour | Rotating/purpose-limited credentials, access control, selective disclosure |
| DoS or availability loss | Community cannot verify or act | Offline queues, independent replicas, rate limits, safe operation modes |
| AI overreach | Octo executes unsafe instruction based on uncertain data | Capability-scoped actions, independent guards, review and kill switch |
| On-chain data leakage | Permanent sensitive identifiers become public | Hash commitments, minimal metadata, no private data on-chain |

## Implemented versus not implemented

**Implemented in the local demo:** Ed25519 signature check, chain sequence, simple policy allowlist and revocation behaviour, process-memory replay detection for a localhost endpoint, local manifest digest matching.

**Not implemented:** authenticated registry/policy updates, production enrolment, persistent replay database, secure element integration, remote attestation, TLS/API authentication, certificate issuance, tamper-resistant sensing, trusted time, access control over graph projections or real-world actuation.

## Safe-default rules

- Bind the demo server to `127.0.0.1`, never `0.0.0.0` by default.
- Never paste real API credentials, private keys, wallet mnemonics or personal readings into example JSON.
- Never let an Octo trigger an actuator or spend money from a single signed observation.
- Treat all experimental trust indicators as *demonstration only*.
- Treat the site’s mention of ISO standards as architectural context, not evidence that this new kit or node is certified.

## Assurance rubric

**L0 — simulated:** software key and synthetic readings. **L1 — protected key:** secure element with tested key protection. **L2 — attested platform:** validated provenance of approved firmware and device. **L3 — corroborated observation:** measurements supported by calibrated, independent evidence. **L4 — governance-authorised:** documented decision rights, current policy and audit/appeal. These are **proposed local labels**, not an industry standard; levels are not automatically cumulative or universal.
