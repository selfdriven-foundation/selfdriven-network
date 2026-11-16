# 06 — Cardano, anchors and accountable action

## Why optional anchoring might help

A blockchain can offer public ordering and long-term commitment evidence for a *small digest* of off-chain records. It cannot prove whether an environmental or energy reading is accurate, whether a device was authorised, or whether a governance decision was legitimate.

A community could periodically publish a digest of a verified evidence batch, leaving detailed records in community storage and providing selective proof to legitimate reviewers.

## What v0.1 does

`src/network.js` creates a **local anchor manifest** containing:

```json
{
  "format": "selfdriven.network.anchor-manifest.v0.1",
  "communityId": "community:solar-commons",
  "evidenceCount": 3,
  "evidenceHead": "sha256:<last-event-hash>",
  "digest": "sha256:<batch-digest>",
  "chain": "none",
  "status": "not-submitted"
}
```

The `digest` is SHA-256 over deterministically encoded `domain`, `communityId` and the ordered event-hash list. This is a **demo-specific commitment**, not a Merkle root. Once published, a real design must specify byte canonicalisation, uniqueness, chain/reorg policy, record availability, verifier interoperability and versioning.

## Future Cardano flow

1. Independently verify the batch and community approvals.
2. Compute a stable batch digest using an agreed encoding.
3. Build a Cardano transaction with the selected metadata label or application protocol.
4. Sign via a wallet with appropriate custody and explicit authorisation.
5. Submit, monitor inclusion, wait for appropriate confirmation depth.
6. Store transaction ID, network, slot and applied policy as separate evidence.
7. Offer independent inclusion and mapping verification.

Cardano transaction metadata supports compact CBOR-encoded structured data under integer metadata labels. It should hold **hashes and minimal metadata**, not personal data, device private keys or raw measurements.

## Octos and governance

An Octo can compare measurements against community goals, flag anomalies or draft a decision. It should not obtain implicit transfer authority, claim ownership or automatically issue rewards because an input is signed. Capability boundaries, human review, dispute processes and economic settlement proofs are separate protocol concerns.

## Avoid premature tokenisation

Start with integrity and usable data. Do not assume a signed energy reading is an accepted unit of value, regulatory-grade proof, a carbon credit, or a basis for OCTO issuance. Incentives can distort sensors and reporting; assess adverse behaviour before offering economic rewards.
