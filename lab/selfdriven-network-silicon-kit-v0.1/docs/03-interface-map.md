# 03 — Mapping to the eight selfdriven interfaces

| Published interface | Role in a silicon-enabled network | Proposed integration, not yet confirmed |
|---|---|---|
| Human | Identity, participation and meaningful human approval | View evidence, consent, challenge, governance dashboard |
| Social | Distributed social identity and discoverability | Optional community affiliation, not a source of device truth |
| Entity | Communities, resources, relationships and organisational activity | Community asset record, device registration, activity linkage |
| Attachment | Manage referenced evidence artefacts | Store source files or supporting calibration documents, with access rules |
| SSI | Device and human identity, credentials, presentations | Issued device operator credentials; issuer trust and revocation |
| AI | Contextual interpretation and autonomous assistance | Octo consumes only labelled, verified evidence and explains uncertainty |
| OnChain | Optional public commitments, accounts and transactions | Batch hash anchor without raw identifying evidence |
| Infra | Compute, storage, telecom, sensors, physical and virtual nodes | Device gateway, secure element, node status, resource measurement |

The **Interfaces Node** concept also identifies **Core** as a foundational artefact capability. In this kit, Core is treated as the authoritative home for community context and linked artefacts, subject to the real implementation's access rules. This terminology is a mapping proposal, not a replacement for existing interface specifications.

## Application: community energy commons

A community runs a small energy asset, with three device roles:

- **Meter**: measures energy. Its calibration, reference measurements and tamper seals determine physical evidence quality.
- **Host node**: obtains readings and composes events. It can lose connectivity and later synchronise a queue.
- **Signing device**: protects a signing key and authenticates events. Its assurance depends on provisioning and hardware verification.

On the network, an Entity/Core artefact represents the asset and its governance. SSI can bind an operator or device credential after approval. Attachment can link calibration certificates. Infra reports capability and health. AI can propose a maintenance action. Humans or authorised community processes decide whether to act. OnChain can record a compact public commitment if appropriate.

## Alternative pilots

**Environmental stewardship:** capture temperature, water-quality or air-sensor evidence; do not treat an uncalibrated device as a regulatory measurement.

**Shared resource exchange:** attest use of a community workshop resource; enforce privacy and fair access before any reputation or reward system.

**Octonomous task executor:** hardware-backed keys for a local Octo operating actuator requests, with explicit capability limits, audit records and an independent emergency stop.

**Distributed network node:** attest firmware/software measurements and heartbeat provenance, then report into a community-operated infrastructure catalogue. A heartbeat is not proof of service quality.

## A first non-negotiable decision

Agree which existing interface owns device enrolment and revocation, and which interface stores the authoritative version of the policy. This kit uses unsigned JSON mock files until that is decided.
