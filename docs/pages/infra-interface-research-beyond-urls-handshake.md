---
layout: default
permalink: /infra-interface/research/handshake-beyond-urls/
title: "Handshake and the Post-URL Internet"

---

# Handshake and the Post-URL Internet

## 1. Handshake = Decentralised Naming Layer

At its core, **Handshake (HNS)** replaces **ICANN’s centralised DNS root** with a **blockchain-based registry of top-level domains (TLDs)**.  
So instead of `.com` or `.org` being controlled by Verisign or ICANN, *you* can own `.selfdriven` directly — cryptographically, not via lease.

👉 That makes it a **trustless namespace** — no central root authority, no revocation risk.

---

## 2. The Naming Layer Is Still Needed — Even for AI

Even in a post-URL world, something has to map **human/agent intent → resource identity**.  
Handshake can provide that base layer of truth:

| Layer | Role | Handshake’s Fit |
|-------|------|-----------------|
| **Identity layer** | Who is this? | DID: `did:selfdriven:foundation` |
| **Naming layer** | What’s it called / reachable as? | HNS TLD `.selfdriven` |
| **Intent layer** | What do I want to do? | AI resolves action: “fetch the governance charter” |

Handshake anchors **namespaces** that can point to:
- DID documents  
- IPFS hashes  
- Smart contract endpoints  
- Semantic graph nodes  
- AI “intent brokers”

That gives AIs and humans a **stable trust root** when verifying provenance.

---

## 3. Handshake + DIDs = Verifiable Web Roots

A Handshake name could *become* a DID controller:

did:hns:selfdriven

That DID could reference:
- A DID document with public keys and service endpoints  
- IPFS content roots (CID-based addressing)  
- Proofs for credentials or governance artifacts  

So **HNS provides the anchor**, while **SSI provides the trust fabric**.

---

## 4. From DNS → DRS (Decentralised Resource System)

Imagine the progression:

| Old Web | Emerging Web |
|----------|---------------|
| DNS (centralised) | HNS (decentralised) |
| URLs | DIDs / CIDs / Intents |
| HTTPS certs | Cryptographic proofs |
| Central CA | Self-sovereign verification |

In that sense, **Handshake is the bootstrap system** — it lets AIs, agents, and organisations reference authentic roots of knowledge or identity without trusting ICANN or Google.

---

## 5. AI Context Resolution Example

When an AI receives an intent like:

> “Find the verified constitution for the selfdriven.foundation”

It might:
1. Resolve `.selfdriven` via Handshake (to get a DID or CID).  
2. Retrieve the DID document for trust keys.  
3. Verify a VC (Verifiable Credential) containing the constitution.  
4. Serve the document with verified provenance.

All without `https://` — but with stronger authenticity.

---

## 6. TL;DR

Handshake gives AI systems a **neutral, cryptographic naming layer** for:
- Decentralised trust roots  
- Verifiable identity linkage  
- Cross-protocol interoperability (DID/IPFS/Intent graphs)

---

*Handshake is DNS for the self-aware web — where names don’t just locate things, they mean things.*

---

### Research

- [Beyond URLs](/infra-interface/research/beyond-urls/)