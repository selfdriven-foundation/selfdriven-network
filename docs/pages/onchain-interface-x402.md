---
layout: default
title: x402 - OnChain Interface - selfdriven Network
permalink: /onchain-interface/x402
---

# OnChain Interface - x402

* x402.onchain.interface.selfdriven.network  

**Version**

- 2.4 (AUG2025)

**Methods**

* “x402”

1) Flow overview
	1.	Client/agent hits a paywalled route → your Gateway replies:
	•	HTTP 402 with x402-* headers: price, asset, destination address, memo (includes rid, scope, nonce), and a x402-callback URL.
	2.	Payer sends USDM to your destination address with tx metadata embedding the memo (use your own numeric metadata label, e.g. 903402).
	3.	Your Facilitator (below) verifies:
	•	Exact asset (USDM policyId + assetName)
	•	Exact amount
	•	recent tx to your address
	•	metadata contains {rid, scope, nonce} (matches the offer)
	•	nonce unused (replay protection)
	4.	Facilitator marks rid as covered → Gateway replays the original request upstream.

2) Headers (suggested)

These match what you already mocked earlier; keep them stable per route:

x402-price: 0.50               // USD
x402-asset: cardano:{USDM_POLICY_ID}.USDM
x402-chain: cardano-mainnet
x402-destination: addr1...selfdriven
x402-memo: <base64url(JSON({rid, scope, nonce}))>
x402-callback: https://pay.selfdriven.network/_x402/settlement

3) Minimal data model (SQL-ish)

CREATE TABLE x402_offer (
  rid VARCHAR(64) PRIMARY KEY,        -- request id
  scope VARCHAR(64) NOT NULL,         -- e.g., "ai.run"
  nonce VARCHAR(64) NOT NULL UNIQUE,
  asset_policy VARCHAR(64) NOT NULL,  -- USDM policy id
  asset_name VARCHAR(64) NOT NULL,    -- "USDM"
  amount_lovelace BIGINT NOT NULL,    -- price in "USDM decimals" scaled to policy (use raw integer amount)
  dest_addr TEXT NOT NULL,            -- bech32
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE x402_receipt (
  tx_hash VARCHAR(64) PRIMARY KEY,
  rid VARCHAR(64) NOT NULL,
  payer_addr TEXT,
  slot BIGINT,
  amount BIGINT,
  verified BOOLEAN NOT NULL,
  verified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

4) Node facilitator (Express, Blockfrost, .then() style)

Replace YOUR_BLOCKFROST_KEY, USDM_POLICY_ID, MERCHANT_ADDR.

// package.json deps (example):
// "express", "axios", "base64url", "uuid", "mysql2" (or pg), "dotenv"

const express = require('express');
const axios = require('axios');
const base64url = require('base64url');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '256kb' }));

// === CONFIG ===
const BLOCKFROST_API = 'https://cardano-mainnet.blockfrost.io/api/v0';
const BF_HEADERS = { project_id: process.env.BLOCKFROST_KEY || 'YOUR_BLOCKFROST_KEY' };

const CHAIN = 'cardano-mainnet';
const USDM_POLICY_ID = process.env.USDM_POLICY_ID || 'USDM_POLICY_ID';
const USDM_ASSET_NAME = 'USDM';                 // raw on-chain name may be hex; see NOTE below
const MEMO_LABEL = 903402;                      // your application-specific metadata label
const MERCHANT_ADDR = process.env.MERCHANT_ADDR || 'addr1...selfdriven';

// === UTIL: DB STUBS (replace with real DB) ===
const offers = new Map();   // rid -> offer
const receipts = new Map(); // tx_hash -> receipt

function saveOffer(o) { offers.set(o.rid, o); return Promise.resolve(o); }
function getOffer(rid) { return Promise.resolve(offers.get(rid)); }
function nonceUsed(nonce) {
  let used = false; offers.forEach(o => { if (o.nonce === nonce) used = true; });
  return Promise.resolve(used);
}
function saveReceipt(r) { receipts.set(r.tx_hash, r); return Promise.resolve(r); }

// === 1) Issue an x402 offer (you call this from your gateway before 402) ===
app.post('/_x402/offer', (req, res) => {
  const scope = (req.body && req.body.scope) || 'ai.run';
  const priceUsd = (req.body && req.body.priceUsd) || 0.5;
  const rid = uuidv4().replace(/-/g, '').slice(0, 24);
  const nonce = uuidv4().replace(/-/g, '').slice(0, 16);

  // Convert price USD -> USDM raw amount.
  // If USDM is 6 decimals (check your asset), multiply by 1e6.
  const amountRaw = Math.round(priceUsd * 1e6);

  const offer = {
    rid, scope, nonce,
    asset_policy: USDM_POLICY_ID,
    asset_name: USDM_ASSET_NAME,
    amount: amountRaw,
    dest_addr: MERCHANT_ADDR
  };

  saveOffer(offer).then(() => {
    const memo = base64url.encode(JSON.stringify({ rid, scope, nonce }));
    res.json({
      headers: {
        'x402-price': String(priceUsd),
        'x402-asset': `cardano:${USDM_POLICY_ID}.${USDM_ASSET_NAME}`,
        'x402-chain': CHAIN,
        'x402-destination': MERCHANT_ADDR,
        'x402-memo': memo,
        'x402-callback': 'https://pay.selfdriven.network/_x402/settlement'
      },
      rid
    });
  });
});

// === 2) Settlement callback (client/agent can POST txHash, or omit and we will poll) ===
app.post('/_x402/settlement', (req, res) => {
  const memoB64 = req.body && req.body.memo;
  const txHash = req.body && req.body.txHash; // optional but preferred
  if (!memoB64) return res.status(400).json({ error: 'missing memo' });

  let memo;
  try { memo = JSON.parse(base64url.decode(memoB64)); } catch (e) {
    return res.status(400).json({ error: 'bad memo' });
  }

  const { rid, scope, nonce } = memo;
  let offerRef;

  getOffer(rid).then(o => {
    if (!o) return Promise.reject(new Error('unknown rid'));
    offerRef = o;
    // replay protection (nonce must match this rid’s stored nonce)
    if (o.nonce !== nonce) return Promise.reject(new Error('nonce mismatch'));
    return Promise.resolve();
  }).then(() => {
    if (txHash) {
      // Verify a specific tx
      return verifyTxAgainstOffer(txHash, offerRef, memo);
    } else {
      // Poll recent txs to destination and try to match one
      return findMatchingTxForOffer(offerRef, memo);
    }
  }).then(result => {
    if (!result.verified) return res.status(402).json({ verified: false, reason: result.reason });
    // Record receipt
    return saveReceipt({
      tx_hash: result.txHash,
      rid,
      payer_addr: result.payer || null,
      slot: result.slot || null,
      amount: offerRef.amount,
      verified: true
    }).then(() => {
      // You’d also mark the RID “covered” in your gateway store here
      res.json({ verified: true, txHash: result.txHash });
    });
  }).catch(err => {
    res.status(400).json({ verified: false, error: err.message });
  });
});

// === Blockfrost helpers ===

// Find a matching tx to MERCHANT_ADDR with USDM and memo = {rid,scope,nonce}
function findMatchingTxForOffer(offer, memo) {
  // 1) List latest txs to address (narrow window — you can widen if needed)
  return axios.get(`${BLOCKFROST_API}/addresses/${MERCHANT_ADDR}/transactions?count=20&order=desc`, { headers: BF_HEADERS })
    .then(r => r.data || [])
    .then(txs => {
      // Try each tx for a match
      const chain = Promise.resolve();
      let found = null;

      return txs.reduce((p, t) => p.then(() => {
        if (found) return Promise.resolve();
        return verifyTxAgainstOffer(t.tx_hash, offer, memo).then(v => {
          if (v.verified) found = v;
        });
      }), chain).then(() => {
        return found || { verified: false, reason: 'no matching tx found' };
      });
    });
}

// Verify single tx: asset, amount, dest output, and metadata memo
function verifyTxAgainstOffer(txHash, offer, memo) {
  let tx, meta, utxos;
  return axios.get(`${BLOCKFROST_API}/txs/${txHash}`, { headers: BF_HEADERS })
    .then(r => { tx = r.data; return axios.get(`${BLOCKFROST_API}/txs/${txHash}/metadata`, { headers: BF_HEADERS }); })
    .then(r => { meta = r.data; return axios.get(`${BLOCKFROST_API}/txs/${txHash}/utxos`, { headers: BF_HEADERS }); })
    .then(r => {
      utxos = r.data;

      // A) Metadata check
      const memoOk = metadataHasMemo(meta, memo);
      if (!memoOk) return { verified: false, reason: 'memo not found' };

      // B) Output check: ensure one output to MERCHANT_ADDR with the USDM amount >= offer.amount
      const match = outputMatches(utxos.outputs, MERCHANT_ADDR, offer.asset_policy, offer.asset_name, offer.amount);
      if (!match) return { verified: false, reason: 'output/amount/asset mismatch' };

      return { verified: true, txHash, slot: tx.slot, payer: (utxos.inputs && utxos.inputs[0] && utxos.inputs[0].address) || null };
    })
    .catch(e => ({ verified: false, reason: `lookup failed: ${e.message}` }));
}

function metadataHasMemo(metaArr, memo) {
  if (!Array.isArray(metaArr)) return false;
  // Blockfrost returns [{label:"903402", json_metadata:{...}}, ...]
  const entry = metaArr.find(m => String(m.label) === String(MEMO_LABEL));
  if (!entry || !entry.json_metadata) return false;

  // Be tolerant to either an object or nested structure
  const j = entry.json_metadata;
  return j.rid === memo.rid && j.scope === memo.scope && j.nonce === memo.nonce;
}

function outputMatches(outputs, destAddr, policyId, assetName, minAmountRaw) {
  if (!Array.isArray(outputs)) return false;

  // NOTE: Blockfrost asset name is hex. If your “USDM” is hex-encoded on-chain,
  // set USDM_ASSET_NAME_HEX in env and compare against that instead.
  const assetNameHex = process.env.USDM_ASSET_NAME_HEX || Buffer.from(assetName, 'utf8').toString('hex');

  return outputs.some(o => {
    if (o.address !== destAddr) return false;
    if (!Array.isArray(o.amount)) return false;
    // amount is an array of { unit, quantity } where unit = policyId + assetNameHex (or "lovelace")
    const unitId = policyId + assetNameHex;
    const asset = o.amount.find(a => a.unit === unitId);
    if (!asset) return false;
    const qty = BigInt(asset.quantity);
    return qty >= BigInt(minAmountRaw);
  });
}

// === 3) Example “paywalled” route wrapper (gateway side) ===

// This is what your gateway would do BEFORE returning 402.
// In practice you embed this into your existing proxy/middleware.
app.get('/api/ai/run', (req, res) => {
  // (1) Check SSI VC entitlements & quota here…
  const covered = false; // say not covered → we generate an offer

  if (!covered) {
    axios.post('http://localhost:3000/_x402/offer', { scope: 'ai.run', priceUsd: 0.5 })
      .then(r => {
        const h = r.data.headers;
        res.status(402)
          .set({
            'x402-price': h['x402-price'],
            'x402-asset': h['x402-asset'],
            'x402-chain': h['x402-chain'],
            'x402-destination': h['x402-destination'],
            'x402-memo': h['x402-memo'],
            'x402-callback': h['x402-callback']
          })
          .send('Payment required');
      });
  } else {
    // proxy to origin…
    res.json({ ok: true });
  }
});

app.listen(3000, () => console.log('x402-cardano facilitator on :3000'));

----

Notes & switches
	•	USDM asset name: On-chain asset names are hex. If USDM’s name is hex (likely), set USDM_ASSET_NAME_HEX and compare using policyId + assetNameHex.
	•	Indexers:
	•	Blockfrost: easiest; rate-limited; SLA via paid plans.
	•	Ogmios + Kupo: self-hosted, low latency. Replace the 3 Blockfrost calls with:
	•	Kupo: query UTXOs at MERCHANT_ADDR filtered by policyId.assetNameHex
	•	Ogmios: fetch tx metadata by tx hash (or Kupo annotation if you store).
	•	Latency: For better UX, allow optimistic unlock on mempool detection from your own node, and revoke on chain failure for high-value endpoints.
	•	Security:
	•	Exact-match policyId & asset name.
	•	Exact amount (or ≥ if you allow tips).
	•	Nonce single-use (store with rid).
	•	Short expiry on offers (e.g., 15 min).
	•	Same-destination check (must be your MERCHANT_ADDR).
	•	Accounting: export x402_receipt to your books; if you want on-chain receipts, mint a tiny CIP-68 v2 “receipt NFT” referencing the tx_hash and rid.

Curl sanity checks

# 1) Create an offer
curl -sX POST http://localhost:3000/_x402/offer \
  -H 'content-type: application/json' \
  -d '{"scope":"ai.run","priceUsd":0.5}' | jq

# 2) After paying, call settlement (with tx hash if you have it)
curl -sX POST http://localhost:3000/_x402/settlement \
  -H 'content-type: application/json' \
  -d '{"memo":"<base64url memo from offer>","txHash":"<your_tx_hash>"}' | jq


- [**x402 Facilitator - Node.js, Ogmios + Kupo**](/onchain-interface/x402/facilitator/)


## Resources
- [Get Help, Log an Issue](https://github.com/selfdriven-foundation/selfdriven-network/issues)
- [selfdriven.fyi/on-chain](https://selfdriven.fyi/on-chain)  
- [selfdriven.ai](https://selfdriven.ai)
- [Code GitHub Repo](https://github.com/selfdriven-tech/interface-onchain)