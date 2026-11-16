# 11 — Community stewardship, openness and decisions

## Why governance is technical

When evidence can influence access, value, reputation, resource allocation or action by an Octo, whoever controls enrolment and policy controls real outcomes. A cryptographically strong device should not obscure a weak democratic process.

## A proposed stewardship model

**Contributors:** publish and review open specifications, test vectors and reference code. **Community operators:** configure local enrolment, retention, calibration, fail-safe procedures and appeals. **Independent verifiers:** use the same public contract to reject malformed or unauthorised claims. **Auditors:** evaluate technical and community effects. **Maintainers:** publish security notices, deprecation rules and interoperability suites.

## Agreements to prepare before a field trial

- Who owns and may export the community evidence and its derivatives.
- Who can enrol, suspend, revoke or rotate a device identity.
- How data is consented, minimised, retained and deleted where possible.
- How communities handle disagreements between a signed record and reality.
- Whether AI output can ever invoke a physical device, and how authorisation is checked.
- How accessible and educational the tools should remain to operators.
- Which responsibilities are borne by the device maker, network host and community.

## Proposed technical licensing path

The kit intentionally declares `UNLICENSED` pending a contributor/owner decision. Before public release, choose appropriate open licences for **code**, **RTL**, **documentation** and **design assets**, and review compatibility with upstream libraries and secure-element hardware licences. An open PDK's individual licence does not automatically license an entire chip or design flow.

## First workshop decision register

| Decision | Suggested default | Owner to confirm |
|---|---|---|
| First physical proof | community renewable-energy observation | pilot community |
| Evidence owner | community-designated custodian | governance group |
| Device identifier | scoped public-key fingerprint (temporary) | SSI maintainers |
| Device enrolment authority | revocable community-appointed issuers | governance group |
| Authorisation location | Entity/Core-linked policy | interface maintainers |
| Verification boundary | independent verifier before ingestion | security reviewers |
| AI role | advise/flag, not independent high-impact actuator | community steward |
| On-chain use | optional batch digest only | OnChain/community team |
| Silicon | existing audited secure-element candidate first | hardware team |
| Open-source publication | after licence and security review | rights holders |

## Invitations to collaborate

Designers of RISC-V secure elements, developers of selfdriven Interfaces Node, SSI protocol specialists, community infrastructure operators, verification researchers, educators, privacy specialists and Cardano builders can each contribute independently. The smallest useful contribution is an interoperable **test vector + verification implementation**.
