# selfdriven.network Silicon Kit

**Version:** 0.1 — proposed integration and learning kit  
**Date:** 16 November 2026  
**Status:** runnable local software demo; no hardware attestation; no production network connection  
**Context:** selfdriven Network Interfaces Node / community-owned infrastructure  

> **A device should be able to prove what it signed. A community should be able to decide what that evidence means, who may use it, and what it may cause.**

## Purpose

Adapt the foundational **selfdriven Silicon Kit** to the actual published direction of [selfdriven.network](https://www.selfdriven.network/): eight documented interfaces — **Human, Social, Entity, Attachment, SSI, AI, OnChain and Infra** — and a proposed distributed Interfaces Node. The kit proposes a small hardware trust primitive that lets a physical resource participate in community workflows without silently transferring governance to a device, AI model, vendor or blockchain.

The design is **not** an assertion that the proposed evidence-ingest API, VCG structures, attestation protocol or manufacturing circuit already exist in production. They are proposals to validate with the network maintainers.

## Contents

| Area | Material | State |
|---|---|---|
| Architecture | community and network interface map, trust boundaries, flow diagram | proposed |
| Core demo | Ed25519 signed, hash-chained simulated energy observations | working local simulation |
| Community policy | illustrative registry, permissions, revocation and replay handling | working local simulation; not secured governance |
| VCG | a graph projection from an evidence event | JSON proposal only |
| OnChain | local batch digest manifest for later Cardano anchoring | not broadcast |
| Network bridge | localhost-only HTTP POST mock; proposed API envelope | not compatible with live APIs |
| Hardware | secure element and open silicon pathway; toy RTL counter | design/research |
| Guide | hands-on labs, use cases, threat model, roadmap, decision register | documentation |

## 5-minute quick start

Requires Node.js 20+; no external npm packages.

```sh
npm run demo
npm run verify
npm test
npm run serve
```

The first command regenerates `examples/` using a new **ephemeral software** Ed25519 key. This key is never saved. `npm run verify` independently verifies the current example chain and locally provided registry/policy. `npm test` tests acceptance and failure cases. The last command starts a **localhost-only** mock endpoint at `http://127.0.0.1:8790`.

In another terminal, run:

```sh
node -e "const fs=require('node:fs');const body={events:JSON.parse(fs.readFileSync('examples/evidence.json')).events,registry:JSON.parse(fs.readFileSync('examples/community-registry.json')),policy:JSON.parse(fs.readFileSync('examples/community-policy.json'))};fetch('http://127.0.0.1:8790/demo/ingest',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json()).then(console.log).catch(console.error)"
```

**No calls to selfdriven.network, Cardano, wallets or external services occur.** This is a safe demonstration of an *integration pattern*, not an authorised API client.

## Architecture in one view

```text
  [Person / Community / Octo]
               |
    [Local governance, consent and access policy]
               |
    [selfdriven.network Interfaces Node — proposed bridge]
       +---------+---------+----------+--------+
       |         |         |          |        |
     Entity     SSI       AI       OnChain     Infra
    / Core   identity  reasoning   anchors   device IO
       |         |         |          |        |
       +---------+----[Signed Evidence]----------+
                          |
                  [Local host / gateway]
                          |
                  [Protected signer]
                          |
                [Sensor / physical resource]
```

The **cryptographic** verification result, **community authority** result, **hardware provenance** result and **physical measurement trust** result are separate properties. A signed event does not prove real-world truth.

## Files

- [`docs/`](docs/) — twelve focused chapters plus bibliography
- [`src/silicon-protocol.js`](src/silicon-protocol.js) — inherited educational evidence profile
- [`src/network.js`](src/network.js) — local policy, graph projection and anchor manifest
- [`src/demo.js`](src/demo.js) — sample generation
- [`src/verify.js`](src/verify.js) — offline bundle verification
- [`src/server.js`](src/server.js) — `127.0.0.1` mock POST adapter and in-memory replay check
- [`test/`](test/) — executable tests
- [`schemas/`](schemas/) — proposed JSON shape descriptions
- [`examples/`](examples/) — regenerated, public-only sample data
- [`rtl/`](rtl/) — educational counter, not a secure IC
- [`web/evidence-verifier.html`](web/evidence-verifier.html) — standalone browser evidence inspector
- [`web/network-map.html`](web/network-map.html) — standalone, offline visual interface map

## Design commitments

1. **Hardware independence:** begin with standard MCU and secure element options; ASIC only after clear needs.
2. **Minimum information:** device keys and event evidence are not personal identity, real-time tracking or general authorisation.
3. **Local ownership:** a community can enrol, suspend or revoke devices subject to transparent governance.
4. **Context before action:** network software decides meaning and authority, not silicon alone.
5. **Fail-closed for risky actions:** no automated energy settlement, safety control or financial transfers in the sample.
6. **Interoperability:** propose adapters rather than assume a new method exists in deployed network interfaces.
7. **Verifiability:** independent signature checks and explicit evidence assurance levels.

## Important limits

- The locally supplied registry and policy are **unsigned**; anyone with write access can alter them.
- The source meter is simulated, not independently calibrated. Clock timestamps are provided by software.
- Ephemeral software keys are not secure-element keys and have no vendor or manufacturer attestation.
- Local JSON examples do not demonstrate consent, a distributed consensus, long-term anti-replay or chain finality.
- The prototype is **not security-audited**. Do not place it on the public Internet or use it for critical decisions.

## Reference sites

- https://www.selfdriven.network/
- https://www.selfdriven.network/interfaces-node/
- https://www.tropicsquare.com/documentation
- https://opentitan.org/book/doc/security/specs/attestation/
- https://developers.cardano.org/docs/build/transaction-metadata/how-to-create-a-metadata-transaction-wallet/

All names and proposed integration interfaces here are a **working design proposal**. No Foundation approval, brand registration, publication permission or code licence is inferred. `package.json` intentionally remains `UNLICENSED` pending contributor decisions.
