---
layout: selfdriven
title: EarthNode Situation Analysis - WorldMobile - Infra Interface - selfdriven Network
permalink: /infra-interface/worldmobile/earthnode/situation-analysis
---

# Infra Interface - WorldMobile - EarthNode - Situation Analysis

# World Mobile EarthNodes on Cardano — Current Status and Relationship to Unity Nodes

## 1. Deployment Status: Devnet → Testnet → Mainnet

**EarthNode rollouts:**
- Initial private testing on the **Aya Testnet (2023)** proved stability and transaction throughput.  
- The **World Mobile Chain (WMC) Public Testnet** launched Dec 2024, allowing community validators to trial staking, DID, and telecom modules.  
- In **mid-2025**, World Mobile opened the **Developer Mainnet** — a production-grade “pre-mainnet” carrying live telecom traffic with whitelisted EarthNodes.  
- **August 2025:** WMC **Public Mainnet** went fully live, operating as an **L3 on Arbitrum Orbit (Base settlement)**.  
  → EarthNode software for community operators is being finalized and released progressively.  

📘 **Sources:**  
- [World Mobile – Developer Mainnet Announcement (June 2025)](https://worldmobile.io/blog/introducing-world-mobile-chain-developer-mainnet-a-genesis-moment)  
- [World Mobile – Public Mainnet Launch (Aug 2025)](https://worldmobile.io/blog/a-milestone-for-decentralized-connectivity-world-mobile-chain-public-mainnet-now-live)  
- [World Mobile – Public Testnet “Aya” Launch (Dec 2024)](https://worldmobile.io/blog/the-next-era-of-connectivity-world-mobile-chain-public-testnet-goes-live)

**Summary:**  
> EarthNodes are moving from testnet and Dev Mainnet into **public mainnet**, processing real telecom transactions and subscriber usage data (IPDRs). Full decentralization of block production by community ENOs begins late 2025.

---

## 2. EarthNode Functionality & Roles

**EarthNodes = “Brains of the Network.”**  
They power the **World Mobile Chain** and perform four main tasks:

| Function | Description |
|-----------|--------------|
| **Blockchain Module** | Validates and records transactions — telecom usage, identity proofs, payments — onto WMC. |
| **Telecom Module** | Routes traffic between AirNodes / aerostats, acting as regional data relays. |
| **DID Module** | Issues & verifies decentralized identities (DIDs) for user access and authentication. |
| **Governance Module** | EarthNodes vote on protocol updates and parameter changes (≈ 1 000 governance nodes). |

Other capabilities include:
- **Data Sovereignty & Privacy:** EarthNodes encrypt and hash telecom usage data on-chain, keeping personal info private.  
- **Cross-Chain Anchoring:** WMC checkpoints can anchor to Base and bridge to Cardano.  
- **Staking & Consensus:** Each ENNFT locks **100 000 WMT**, securing consensus and determining block participation.  

📘 **Sources:**  
- [World Mobile – EarthNodes: The Heart of the Network (2022)](https://worldmobile.io/blog/earthnodes-the-heart-of-the-world-mobile-network)  
- [WMC Documentation – “Modules Overview”](https://docs.worldmobile.io)  
- [World Mobile – The Chain Overview](https://worldmobile.io/the-chain)

---

## 3. Relationship Between EarthNodes and Unity Nodes

### What are Unity Nodes?
Unity Nodes, launched with **Minutes Network (MNT)** in 2025, are smartphone-based **edge verifiers** that make automated test calls to detect telecom faults or fraud.

- Each Unity Node = a user’s phone performing **real-world call verification**.  
- Verification data → hashed and submitted to WMC through EarthNodes.  
- Thus, Unity provides **“proof-of-telecom-work”**, EarthNodes provide **trust & audit.**

📘 **Sources:**  
- [Unity Nodes Official Site](https://unity.worldmobile.io)  
- [Minutes Network Litepaper 2025](https://minutes.network)

### How EarthNodes Support Unity
- EarthNodes **receive encrypted issue reports** (call failures, route errors) from Unity Nodes.  
- They **store these proofs on-chain**, giving carriers an immutable audit trail.  
- Unity’s backend (Switch + Validation Nodes) uses EarthNodes as its **ledger and fee-settlement layer**.  

### Rewards and Revenue Flow
- **Unity Node Operators:** earn **75 %** of carrier fees from the verification work.  
- **Remaining 25 %:** pooled and distributed to **WMTx and MNTx reward pools** → shared with **EarthNode operators + delegators**.  
- This links Unity’s real-world telecom revenue to WMC’s staking economy.  

> EarthNodes **don’t pay Unity Nodes directly**; instead, Unity contributes fee revenue to EarthNode pools — creating a positive-feedback economy.

📘 **Sources:**  
- [Unity Nodes FAQ (2025)](https://unity.worldmobile.io/faq)  
- [Minutes Network Docs – Economics](https://minutes.network/docs/litepaper#tokenomics)

---

## 4. Rewards, Staking & Delegation

### EarthNode Operator Rewards
- Each ENNFT (100 000 WMT stake) earns WMT rewards for block production and network usage.  
- During testnet: rewards came via the **World Mobile Vault** (“pre-staking”).  
- On mainnet: rewards now derive from **actual network usage fees** (data traffic, identity checks, Unity pool share).  
- More traffic = more WMTx distributed.

📘 **Sources:**  
- [World Mobile Token Vault Docs](https://docs.worldmobiletoken.com)  
- [EarthNodes.net – Community Delegation Guide](https://earthnodes.net)

### Delegators / Stakers
- Any WMT holder can stake via the **Vault** (Cardano) or **Base smart contract**.  
- Estimated yield: ~ 5 % APY (Core Staking)【approx.】.  
- Delegation is non-custodial; tokens stay in the user’s wallet / Vault.  
- Stakers can optionally **delegate to a specific EarthNode** to share its rewards.  

📘 **Sources:**  
- [World Mobile – Staking Portal](https://worldmobiletoken.com/staking)  
- [WMT Docs – Core Staking FAQ](https://docs.worldmobiletoken.com/core-staking)

### Reward Cycle
- **Snapshots:** taken monthly (Cardano Vault) / per 30-day epoch (Base).  
- **Distribution:** automatic to wallets after each epoch.  
- **Future:** rewards migrate entirely on-chain within WMC smart-contracts.

---

## 5. Becoming an EarthNode Operator or Delegator

### Operating an EarthNode
1. **Obtain an ENNFT** (transferable; secondary markets like [JPG.store](https://jpg.store/collection/earthnode-nft)).  
2. **Register with World Mobile:** link wallet & ENNFT to receive node credentials.  
3. **Set up server:**  
   - Ubuntu 22.04 LTS, ≥ 4 cores / 8 GB RAM / 40 GB+ SSD.  
   - Reliable 24 / 7 uptime, static IP preferred.  
4. **Install EarthNode software** and sync to WMC.  
5. **Monitor** performance via *Mission Control dashboard* and community Discord.

### Delegating WMT (Non-operators)
1. Visit [worldmobiletoken.com](https://worldmobiletoken.com) → Vault login.  
2. Deposit WMT to Vault or bridge to Base.  
3. Choose a node or stake pool.  
4. Keep funds staked for full epoch to earn rewards.

### Developer Opportunities
- WMC supports **EVM contracts** (Solidity / Arbitrum Orbit).  
- Build dApps using telecom data, DIDs, or micro-transactions.  
- **Explorer:** [explorer.worldmobile.io](https://explorer.worldmobile.io)

---

## 6. Summary

| Layer | Function | Current Status (Oct 2025) |
|--------|-----------|---------------------------|
| **World Mobile Chain (WMC)** | L3 blockchain running telecom transactions | **Public Mainnet live** |
| **EarthNodes (ENOs)** | Validators + identity + routing + governance | **Transitioning to community run** |
| **Unity Nodes** | Mobile telecom verifiers feeding data into WMC | **Operational – funding EarthNode pools** |
| **Rewards Flow** | Subscriber fees + Unity fees → WMT pools → ENOs & delegators | **Active** |
| **Staking** | Cardano Vault + Base staking contract | **Open to public** |

---

## 7. Key Takeaways

- EarthNodes are the **core validators** and **telecom routers** of World Mobile.  
- They are **live on public mainnet**, securing a working telecom blockchain.  
- **Unity Nodes** extend network coverage and feed real revenue into EarthNode reward pools.  
- WMT holders can earn by **staking** or by **operating an EarthNode**.  
- The ecosystem is transitioning from controlled deployment → full community decentralization.  

> “Every transaction strengthens the network and benefits its participants.” — *World Mobile, EarthNodes Announcement (2022)*

---

### References

1. [Introducing World Mobile Chain Developer Mainnet – World Mobile Blog (June 2025)](https://worldmobile.io/blog/introducing-world-mobile-chain-developer-mainnet-a-genesis-moment)  
2. [A Milestone for Decentralized Connectivity – Public Mainnet Launch (Aug 2025)](https://worldmobile.io/blog/a-milestone-for-decentralized-connectivity-world-mobile-chain-public-mainnet-now-live)  
3. [EarthNodes: The Heart of the World Mobile Network (July 2022)](https://worldmobile.io/blog/earthnodes-the-heart-of-the-world-mobile-network)  
4. [Unity Nodes / Minutes Network Litepaper (2025)](https://minutes.network/docs/litepaper)  
5. [World Mobile Token Vault Docs](https://docs.worldmobiletoken.com)  
6. [WMT Core Staking FAQ](https://docs.worldmobiletoken.com/core-staking)  
7. [Explorer.worldmobile.io](https://explorer.worldmobile.io)  
8. [JPG.store – EarthNode NFT Listings](https://jpg.store/collection/earthnode-nft)

