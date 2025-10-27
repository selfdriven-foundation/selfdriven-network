---
layout: default
title: x402 - OnChain Interface - selfdriven Network
permalink: /onchain-interface/x402/facilitator/
---

# OnChain Interface - x402 - Facilitator

A) Facilitator (Node.js, Ogmios + Kupo, .then() style)

What it does
	•	Uses Kupo to verify the output: your address received USDM (policyId + assetNameHex) in the right amount.
	•	Uses Ogmios (chain-sync) to cache tx metadata and confirm the memo { rid, scope, nonce } under label 903402.
	•	Exposes:
	•	POST /_x402/offer → returns the headers to send with your 402
	•	POST /_x402/settlement → body { memo, txHash? } verifies payment

Assumes:
	•	Kupo HTTP at http://127.0.0.1:1442
	•	Ogmios WS at ws://127.0.0.1:1337
	•	You run a full Cardano node that Ogmios points to
	•	You know your USDM policyId and assetNameHex

// deps: express axios base64url ws uuid dotenv
const express = require('express');
const axios = require('axios');
const base64url = require('base64url');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '256kb' }));

// ---------- CONFIG ----------
const KUPO = process.env.KUPO || 'http://127.0.0.1:1442';
const OGM   = process.env.OGMIOS || 'ws://127.0.0.1:1337';

const CHAIN = 'cardano-mainnet';
const MEMO_LABEL = Number(process.env.MEMO_LABEL || 903402);

const MERCHANT_ADDR = process.env.MERCHANT_ADDR || 'addr1...selfdriven';
const USDM_POLICY   = process.env.USDM_POLICY_ID || 'YOUR_USDM_POLICY_ID';
const USDM_NAME_HEX = process.env.USDM_ASSET_NAME_HEX || Buffer.from('USDM','utf8').toString('hex'); // override if different on-chain
const USDM_DECIMALS = Number(process.env.USDM_DECIMALS || 6);

// ---------- IN-MEMORY STORES (replace w/ DB in prod) ----------
const offers = new Map();     // rid -> { rid, scope, nonce, amount, ... }
const receipts = new Map();   // txHash -> { ... }
const metaCache = new Map();  // txHash -> { [label]: json }  (from Ogmios)
const MAX_META = 5000;

// ---------- OGMIOS: minimal chain-sync to cache tx metadata ----------
let ogm;
function startOgmios() {
  ogm = new WebSocket(OGM);
  ogm.on('open', () => {
    // Basic chain-sync handshake: request tip and then stream blocks
    // NOTE: Ogmios JSON-RPC frames vary by version; keep this minimal & robust.
    // We do a "findIntersect" at tip, then "requestNext" in a loop.
    ogm.send(JSON.stringify({
      type: 'jsonwsp/request',
      version: '1.0',
      servicename: 'ogmios',
      methodname: 'FindIntersect',
      args: { points: [{ slot: 0, hash: '' }], tip: null }
    }));
  });

  ogm.on('message', (buf) => {
    let msg;
    try { msg = JSON.parse(buf.toString()); } catch { return; }

    // Handle FindIntersect response then immediately request next block
    if (msg?.methodname === 'FindIntersect' || msg?.methodname === 'RequestNext') {
      // Ask for the next block
      ogm.send(JSON.stringify({
        type: 'jsonwsp/request',
        version: '1.0',
        servicename: 'ogmios',
        methodname: 'RequestNext',
        args: {}
      }));
    }

    // When a block arrives, cache each tx’s metadata by hash
    if (msg?.result?.RollForward?.block) {
      const block = msg.result.RollForward.block;
      const txs = block?.body || block?.transactions || []; // tolerate schema differences
      txs.forEach(tx => {
        const hash = tx?.id || tx?.tx?.id || tx?.hash;
        const aux  = tx?.metadata || tx?.auxiliaryData || {};
        if (!hash || !aux) return;
        // Normalise metadata into { [label]: json }
        const labels = {};
        Object.entries(aux).forEach(([label, val]) => {
          // val could be already JSON; keep as-is
          labels[String(label)] = val;
        });
        metaCache.set(hash, labels);
        if (metaCache.size > MAX_META) {
          // drop oldest
          const first = metaCache.keys().next().value;
          if (first) metaCache.delete(first);
        }
      });
    }
  });

  ogm.on('close', () => setTimeout(startOgmios, 1000));
  ogm.on('error', () => {/* handled by close */});
}
startOgmios();

// ---------- KUPO helpers ----------
// Get recent UTxOs (or specific tx) and check an output delivered USDM >= amountRaw to MERCHANT_ADDR.
function kupoOutputsForTx(txHash) {
  // Kupo provides /transactions/<hash> (body includes outputs & assets) on recent versions.
  // If your Kupo version lacks this endpoint, fallback to /matches for address and filter client-side.
  return axios.get(`${KUPO}/transactions/${txHash}`)
    .then(r => r.data)
    .catch(() => null);
}

function kupoRecentForAddress(address, count = 20) {
  // /matches?address=<addr>&order=desc&limit=COUNT
  return axios.get(`${KUPO}/matches`, { params: { address, order: 'desc', limit: count } })
    .then(r => Array.isArray(r.data) ? r.data : []);
}

function outputHasUSDMToMerchant(tx, minAmountRaw) {
  // Expect tx.outputs: [{ address, value: { coins, assets: [{ policyId, assetName, quantity }] } }, ...]
  const outs = tx?.outputs || [];
  const target = outs.find(o => o.address === MERCHANT_ADDR);
  if (!target) return false;
  const assets = (target.value && target.value.assets) || [];
  const unit = assets.find(a => a.policyId === USDM_POLICY && a.assetName === USDM_NAME_HEX);
  if (!unit) return false;
  try { return BigInt(unit.quantity) >= BigInt(minAmountRaw); } catch { return false; }
}

// ---------- VERIFICATION ----------
function metaHasMemo(txHash, rid, scope, nonce) {
  const labels = metaCache.get(txHash);
  if (!labels) return false;
  const m = labels[String(MEMO_LABEL)];
  if (!m) return false;
  // Allow either flat object or nested { memo: {...} } depending on your tx builder
  const j = m.memo ? m.memo : m;
  return j.rid === rid && j.scope === scope && j.nonce === nonce;
}

// ---------- OFFER ----------
app.post('/_x402/offer', (req, res) => {
  const scope = (req.body && req.body.scope) || 'ai.run';
  const priceUsd = Number((req.body && req.body.priceUsd) || 0.5);

  const rid = uuidv4().replace(/-/g, '').slice(0, 24);
  const nonce = uuidv4().replace(/-/g, '').slice(0, 16);

  // USD → USDM raw (assume 6 decimals)
  const amountRaw = Math.round(priceUsd * Math.pow(10, USDM_DECIMALS));

  const offer = { rid, scope, nonce, amount: amountRaw, dest_addr: MERCHANT_ADDR };
  offers.set(rid, offer);

  const memo = base64url.encode(JSON.stringify({ rid, scope, nonce }));
  res.json({
    headers: {
      'x402-price': String(priceUsd),
      'x402-asset': `cardano:${USDM_POLICY}.${Buffer.from(USDM_NAME_HEX,'hex').toString('utf8') || 'USDM'}`,
      'x402-chain': CHAIN,
      'x402-destination': MERCHANT_ADDR,
      'x402-memo': memo,
      'x402-callback': 'https://pay.selfdriven.network/_x402/settlement'
    },
    rid
  });
});

// ---------- SETTLEMENT ----------
app.post('/_x402/settlement', (req, res) => {
  const memoB64 = req.body && req.body.memo;
  const txHash  = req.body && req.body.txHash; // optional
  if (!memoB64) return res.status(400).json({ error: 'missing memo' });

  let memo; try { memo = JSON.parse(base64url.decode(memoB64)); } catch { return res.status(400).json({ error: 'bad memo' }); }
  const { rid, scope, nonce } = memo;

  const offer = offers.get(rid);
  if (!offer || offer.nonce !== nonce) return res.status(400).json({ error: 'unknown rid/nonce' });

  const verifyTx = (hash) =>
    kupoOutputsForTx(hash).then(tx =>
      (!tx || !outputHasUSDMToMerchant(tx, offer.amount))
        ? { ok: false, reason: 'no matching output' }
        : metaHasMemo(hash, rid, scope, nonce)
          ? { ok: true,  txHash: hash }
          : { ok: false, reason: 'metadata memo missing' }
    );

  const finish = (result) => {
    if (!result.ok) return res.status(402).json({ verified: false, reason: result.reason });
    receipts.set(result.txHash, { rid, txHash: result.txHash, amount: offer.amount, verified: true, at: Date.now() });
    // mark RID covered in your gateway/session store here…
    res.json({ verified: true, txHash: result.txHash });
  };

  if (txHash) {
    verifyTx(txHash).then(finish).catch(e => res.status(400).json({ error: e.message }));
  } else {
    // Poll recent txs to merchant and test each
    kupoRecentForAddress(MERCHANT_ADDR, 25)
      .then(list => list.map(x => x.transactionId))
      .then(hashes => hashes.reduce((p, h) => p.then(r => r.ok ? r : verifyTx(h)), Promise.resolve({ ok: false })))
      .then(finish)
      .catch(e => res.status(400).json({ error: e.message }));
  }
});

app.listen(3000, () => console.log('x402-cardano (kupo+ogmios) on :3000'));

--

// deps: express axios base64url ws uuid dotenv
const express = require('express');
const axios = require('axios');
const base64url = require('base64url');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '256kb' }));

// ---------- CONFIG ----------
const KUPO = process.env.KUPO || 'http://127.0.0.1:1442';
const OGM   = process.env.OGMIOS || 'ws://127.0.0.1:1337';

const CHAIN = 'cardano-mainnet';
const MEMO_LABEL = Number(process.env.MEMO_LABEL || 903402);

const MERCHANT_ADDR = process.env.MERCHANT_ADDR || 'addr1...selfdriven';
const USDM_POLICY   = process.env.USDM_POLICY_ID || 'YOUR_USDM_POLICY_ID';
const USDM_NAME_HEX = process.env.USDM_ASSET_NAME_HEX || Buffer.from('USDM','utf8').toString('hex'); // override if different on-chain
const USDM_DECIMALS = Number(process.env.USDM_DECIMALS || 6);

// ---------- IN-MEMORY STORES (replace w/ DB in prod) ----------
const offers = new Map();     // rid -> { rid, scope, nonce, amount, ... }
const receipts = new Map();   // txHash -> { ... }
const metaCache = new Map();  // txHash -> { [label]: json }  (from Ogmios)
const MAX_META = 5000;

// ---------- OGMIOS: minimal chain-sync to cache tx metadata ----------
let ogm;
function startOgmios() {
  ogm = new WebSocket(OGM);
  ogm.on('open', () => {
    // Basic chain-sync handshake: request tip and then stream blocks
    // NOTE: Ogmios JSON-RPC frames vary by version; keep this minimal & robust.
    // We do a "findIntersect" at tip, then "requestNext" in a loop.
    ogm.send(JSON.stringify({
      type: 'jsonwsp/request',
      version: '1.0',
      servicename: 'ogmios',
      methodname: 'FindIntersect',
      args: { points: [{ slot: 0, hash: '' }], tip: null }
    }));
  });

  ogm.on('message', (buf) => {
    let msg;
    try { msg = JSON.parse(buf.toString()); } catch { return; }

    // Handle FindIntersect response then immediately request next block
    if (msg?.methodname === 'FindIntersect' || msg?.methodname === 'RequestNext') {
      // Ask for the next block
      ogm.send(JSON.stringify({
        type: 'jsonwsp/request',
        version: '1.0',
        servicename: 'ogmios',
        methodname: 'RequestNext',
        args: {}
      }));
    }

    // When a block arrives, cache each tx’s metadata by hash
    if (msg?.result?.RollForward?.block) {
      const block = msg.result.RollForward.block;
      const txs = block?.body || block?.transactions || []; // tolerate schema differences
      txs.forEach(tx => {
        const hash = tx?.id || tx?.tx?.id || tx?.hash;
        const aux  = tx?.metadata || tx?.auxiliaryData || {};
        if (!hash || !aux) return;
        // Normalise metadata into { [label]: json }
        const labels = {};
        Object.entries(aux).forEach(([label, val]) => {
          // val could be already JSON; keep as-is
          labels[String(label)] = val;
        });
        metaCache.set(hash, labels);
        if (metaCache.size > MAX_META) {
          // drop oldest
          const first = metaCache.keys().next().value;
          if (first) metaCache.delete(first);
        }
      });
    }
  });

  ogm.on('close', () => setTimeout(startOgmios, 1000));
  ogm.on('error', () => {/* handled by close */});
}
startOgmios();

// ---------- KUPO helpers ----------
// Get recent UTxOs (or specific tx) and check an output delivered USDM >= amountRaw to MERCHANT_ADDR.
function kupoOutputsForTx(txHash) {
  // Kupo provides /transactions/<hash> (body includes outputs & assets) on recent versions.
  // If your Kupo version lacks this endpoint, fallback to /matches for address and filter client-side.
  return axios.get(`${KUPO}/transactions/${txHash}`)
    .then(r => r.data)
    .catch(() => null);
}

function kupoRecentForAddress(address, count = 20) {
  // /matches?address=<addr>&order=desc&limit=COUNT
  return axios.get(`${KUPO}/matches`, { params: { address, order: 'desc', limit: count } })
    .then(r => Array.isArray(r.data) ? r.data : []);
}

function outputHasUSDMToMerchant(tx, minAmountRaw) {
  // Expect tx.outputs: [{ address, value: { coins, assets: [{ policyId, assetName, quantity }] } }, ...]
  const outs = tx?.outputs || [];
  const target = outs.find(o => o.address === MERCHANT_ADDR);
  if (!target) return false;
  const assets = (target.value && target.value.assets) || [];
  const unit = assets.find(a => a.policyId === USDM_POLICY && a.assetName === USDM_NAME_HEX);
  if (!unit) return false;
  try { return BigInt(unit.quantity) >= BigInt(minAmountRaw); } catch { return false; }
}

// ---------- VERIFICATION ----------
function metaHasMemo(txHash, rid, scope, nonce) {
  const labels = metaCache.get(txHash);
  if (!labels) return false;
  const m = labels[String(MEMO_LABEL)];
  if (!m) return false;
  // Allow either flat object or nested { memo: {...} } depending on your tx builder
  const j = m.memo ? m.memo : m;
  return j.rid === rid && j.scope === scope && j.nonce === nonce;
}

// ---------- OFFER ----------
app.post('/_x402/offer', (req, res) => {
  const scope = (req.body && req.body.scope) || 'ai.run';
  const priceUsd = Number((req.body && req.body.priceUsd) || 0.5);

  const rid = uuidv4().replace(/-/g, '').slice(0, 24);
  const nonce = uuidv4().replace(/-/g, '').slice(0, 16);

  // USD → USDM raw (assume 6 decimals)
  const amountRaw = Math.round(priceUsd * Math.pow(10, USDM_DECIMALS));

  const offer = { rid, scope, nonce, amount: amountRaw, dest_addr: MERCHANT_ADDR };
  offers.set(rid, offer);

  const memo = base64url.encode(JSON.stringify({ rid, scope, nonce }));
  res.json({
    headers: {
      'x402-price': String(priceUsd),
      'x402-asset': `cardano:${USDM_POLICY}.${Buffer.from(USDM_NAME_HEX,'hex').toString('utf8') || 'USDM'}`,
      'x402-chain': CHAIN,
      'x402-destination': MERCHANT_ADDR,
      'x402-memo': memo,
      'x402-callback': 'https://pay.selfdriven.network/_x402/settlement'
    },
    rid
  });
});

// ---------- SETTLEMENT ----------
app.post('/_x402/settlement', (req, res) => {
  const memoB64 = req.body && req.body.memo;
  const txHash  = req.body && req.body.txHash; // optional
  if (!memoB64) return res.status(400).json({ error: 'missing memo' });

  let memo; try { memo = JSON.parse(base64url.decode(memoB64)); } catch { return res.status(400).json({ error: 'bad memo' }); }
  const { rid, scope, nonce } = memo;

  const offer = offers.get(rid);
  if (!offer || offer.nonce !== nonce) return res.status(400).json({ error: 'unknown rid/nonce' });

  const verifyTx = (hash) =>
    kupoOutputsForTx(hash).then(tx =>
      (!tx || !outputHasUSDMToMerchant(tx, offer.amount))
        ? { ok: false, reason: 'no matching output' }
        : metaHasMemo(hash, rid, scope, nonce)
          ? { ok: true,  txHash: hash }
          : { ok: false, reason: 'metadata memo missing' }
    );

  const finish = (result) => {
    if (!result.ok) return res.status(402).json({ verified: false, reason: result.reason });
    receipts.set(result.txHash, { rid, txHash: result.txHash, amount: offer.amount, verified: true, at: Date.now() });
    // mark RID covered in your gateway/session store here…
    res.json({ verified: true, txHash: result.txHash });
  };

  if (txHash) {
    verifyTx(txHash).then(finish).catch(e => res.status(400).json({ error: e.message }));
  } else {
    // Poll recent txs to merchant and test each
    kupoRecentForAddress(MERCHANT_ADDR, 25)
      .then(list => list.map(x => x.transactionId))
      .then(hashes => hashes.reduce((p, h) => p.then(r => r.ok ? r : verifyTx(h)), Promise.resolve({ ok: false })))
      .then(finish)
      .catch(e => res.status(400).json({ error: e.message }));
  }
});

app.listen(3000, () => console.log('x402-cardano (kupo+ogmios) on :3000'));

---

B) cardano-cli: send USDM with metadata 903402

Replace placeholders in <>. Save the JSON as memo.json.

{
  "903402": {
    "rid":   "REPLACE_WITH_RID",
    "scope": "ai.run",
    "nonce": "REPLACE_WITH_NONCE"
  }
}

2) Variables (bash)

# Addresses / keys
SENDER_ADDR="<your_payment_address>"
SENDER_SKEY="<path/to/payment.skey>"
MERCHANT_ADDR="<merchant_address>"

# Asset
USDM_POLICY_ID="<policy_id_of_usdm>"
USDM_NAME_HEX="<asset_name_hex_for_usdm>"   # e.g. 5553444d if plain "USDM"
AMOUNT_RAW=500000        # 0.5 USDM if USDM has 6 decimals

# Node/network
NETWORK="--mainnet"      # or --testnet-magic 1097911063
TMP=$(mktemp -d)

3) Query UTxOs & protocol

cardano-cli query utxo $NETWORK --address "$SENDER_ADDR" --out-file $TMP/utxo.json
TX_IN=$(jq -r 'to_entries|first|"\(.key)#0"' $TMP/utxo.json)  # pick a real UTxO in practice
cardano-cli query protocol-parameters $NETWORK --out-file $TMP/pparams.json

4) Build the tx (USDM → merchant, change back to sender)

# Build output: MERCHANT gets AMOUNT_RAW of USDM + minimum ADA for the output
MIN_ADA_OUT=$(cardano-cli transaction calculate-min-required-utxo \
  --protocol-params-file $TMP/pparams.json \
  --tx-out-inline-datum-present \
  --out-file /dev/stdout \
  --tx-out="$MERCHANT_ADDR + 2000000 + 1 $USDM_POLICY_ID.$USDM_NAME_HEX" | awk '{print $2}')

# Build the transaction
cardano-cli transaction build \
  $NETWORK \
  --tx-in "$TX_IN" \
  --tx-out "$MERCHANT_ADDR + ${MIN_ADA_OUT} + ${AMOUNT_RAW} ${USDM_POLICY_ID}.${USDM_NAME_HEX}" \
  --change-address "$SENDER_ADDR" \
  --metadata-json-file memo.json \
  --invalid-hereafter $(($(cardano-cli query tip $NETWORK | jq .slot) + 600)) \
  --protocol-params-file $TMP/pparams.json \
  --out-file $TMP/tx.body

  If calculate-min-required-utxo complains, drop --tx-out-inline-datum-present (no datum used here) and set a safe min ADA like 2000000.

5) Sign & submit

cardano-cli transaction sign \
  --tx-body-file $TMP/tx.body \
  --signing-key-file "$SENDER_SKEY" \
  $NETWORK \
  --out-file $TMP/tx.signed

cardano-cli transaction submit \
  $NETWORK \
  --tx-file $TMP/tx.signed

After confirmation, call your facilitator:

# memo must be the exact base64url you gave in x402 offer (rid+scope+nonce)
curl -sX POST https://pay.selfdriven.network/_x402/settlement \
  -H 'content-type: application/json' \
  -d '{"memo":"<base64url_memo>", "txHash":"<submitted_tx_hash>"}' | jq

Hardening checklist
	•	Rotate nonce per offer and expire offers (e.g., 15 min).
	•	Compare exact policyId + assetNameHex.
	•	Enforce exact or >= amount (document if you allow tips).
	•	Keep an LRU of observed metadata (we used MAX_META=5000).
	•	Optionally add a small inline datum on the merchant output that mirrors the memo for double-anchoring (Kupo indexes datums well).

If you want, I can tune the Ogmios chain-sync bit to your exact version (so the block/tx fields line up 1:1) and wire this into your existing Gateway so RID → “covered” unblocks onchain.interface.selfdriven.network.