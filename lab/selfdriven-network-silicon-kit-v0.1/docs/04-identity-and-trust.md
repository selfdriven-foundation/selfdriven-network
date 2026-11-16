# 04 — Identity, governance and trust

## Four independently evaluated claims

| Claim | Example test | What it does not prove |
|---|---|---|
| Cryptographic validity | Ed25519 signature matches exact bytes | Device honesty or ownership |
| Community authorisation | An approved registry says device can submit this event type | Registry authenticity unless secured |
| Hardware provenance | Manufacturer/owner attestation chain and measured firmware | Sensor truthfulness or proper governance |
| Observation confidence | Calibrated sensor, corroboration, recorded conditions | Automatically authorised action |

For v0.1, only the first row is implemented cryptographically. The second is simulated through **unsigned local policy**. Hardware provenance and observation confidence are **not implemented**.

## Device identity versus personal identity

The educational identifier `sdid:spki256:...` is a key fingerprint based on the public key's SubjectPublicKeyInfo DER bytes. It is **not** a W3C DID method, not a passport, and not a human identifier. Future SSI mapping should avoid copying persistent device IDs into unnecessary public contexts or creating an invisible surveillance graph.

A community may choose privacy-preserving, purpose-specific credentials that disclose eligibility without exposing a permanent global device history. Actual credential syntax and verification should be selected with the SSI maintainers.

## Lifecycle proposal

1. **Prepare:** operator creates a new protected device key and securely records provisioning evidence.
2. **Enrol:** authorised community reviewers approve device purpose and evidence types.
3. **Operate:** record signed observations with bounded rates and least privilege.
4. **Review:** renew authorisation, firmware posture and sensor quality checks.
5. **Suspend:** temporary restriction for anomalies or lost custody.
6. **Revoke:** remove authorisation and prevent future acceptance.
7. **Rotate:** issue a new key, preserving authorised continuity without asserting keys are equivalent.
8. **Retire:** dispose of hardware, purge keys, and apply retention policy.

## Community governance questions — 5W1H

- **Why:** what outcome does this infrastructure serve, and what are the least harmful alternatives?
- **Who:** members, operators, issuers, verifiers, reviewers and independent challengers.
- **What:** assets, evidence classes, permitted uses, stewardship duties and resources.
- **How:** quorum, appeals, calibration, audit, key recovery and incident escalation.
- **Where:** locality, physical custody, jurisdiction and data-residency conditions.
- **When:** intervals, expiry, review points and incident response windows.

## Proposed roles

**Community steward** approves operating policy; **device custodian** is responsible for hardware; **credential issuer** endorses role or equipment status; **independent verifier** checks bytes, certificates and expiry; **auditor** can review activity and disputes; **Octo** may assist within a revocable, bounded capability. None of these roles should automatically be the device manufacturer's role.

## Key management boundaries

For the first secure-element pilot, verify whether the selected chip supports non-exportable Ed25519 or another approved algorithm, documented firmware provisioning, attestation, secure update and compromise recovery. A product being labelled a secure element does not guarantee every capability or implementation is suitable.
