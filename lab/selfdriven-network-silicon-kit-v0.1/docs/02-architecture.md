# 02 — Network and silicon architecture

## Existing public network direction

The published selfdriven.network website describes eight interfaces: **Human, Social, Entity, Attachment, SSI, AI, OnChain and Infra**. It also describes an **Interfaces Node** initiative centred on SSI, Core/artefacts, Attachment, AI, OnChain and Infra. Its production API pages use HTTP POST with JSON request/response patterns and application authentication. The present kit does **not** assume it has access to any production API.

## Logical layers

```text
  PEOPLE + COMMUNITIES                OCTOS + APPLICATIONS
  Human / Social / governance         authorised assistance
              \                             /
               \                           /
            [Community policy and intent]
                           |
          +----------------+------------------+
          |        selfdriven.network         |
          | Entity/Core: artefacts, context   |
          | SSI: identity and credentials     |
          | Attachment: documents/evidence    |
          | AI: interpret, advise, orchestrate |
          | OnChain: assets, optional anchors  |
          | Infra: physical/virtual resource  |
          +----------------+------------------+
                           |
           [proposed silicon-evidence adapter]
                           |
           [event verification + policy check]
                           |
                  [gateway / MCU host]
                           |
              [hardware protected signing]
                           |
                  [sensor / actuator]
```

## The critical boundaries

**Boundary A: physical to digital.** The sensor and its environment can be wrong, manipulated or misleading. Cryptography does not correct them. Calibration, cross-checking and provenance matter.

**Boundary B: host to signer.** The host can be compromised. Signing policy and secure boot become important when signing has consequences. A generic secure element may secure a key without proving what software composed the message.

**Boundary C: signer to network.** A signature proves control of a cryptographic key over exact bytes. Separately determine device enrolment, community membership, purpose, permitted action and current key status.

**Boundary D: context to action.** A VCG projection or AI interpretation is not itself authorisation. Safety-critical or economically material acts require independent rules and approvals.

## A proposed integration message

The runnable kit creates an illustrative envelope:

```json
{
  "proposal": "selfdriven.network.silicon.bridge.v0.1",
  "interface": "Infra -> Entity/Core / SSI / Attachment / AI / OnChain",
  "transport": "local-mock-only",
  "method": "ingest-signed-evidence",
  "data": { "communityId": "community:solar-commons", "event": "<signed event>" },
  "productionApiCompatibility": "not-established"
}
```

The above is **not** a real documented selfdriven.network method. Its fields are candidate interface design inputs only.

## Data movement

1. The host receives a sample from an explicitly identified sensor source.
2. The signer signs canonicalised event bytes and a domain prefix.
3. An independent verifier checks signature, key binding, sequence and prior hash.
4. A community policy engine examines the enrolment and allowed evidence type.
5. A proposed context-graph projection links device, community and observation without declaring the observation true.
6. Optionally, a batch commitment is prepared for third-party timestamp/anchoring workflows; the example does not submit a transaction.
7. An Octo or human may interpret the result, but the authority to act remains constrained by separate policy.

## Design rule

Treat an **observation**, **signed claim**, **verified signature**, **enrolled device**, **attested hardware**, **validated measurement** and **authorised decision** as different data types, not interchangeable labels.
