# 07 — Silicon, secure elements and open-PDK path

## Build with existing hardware first

The highest-value early question is not whether a custom chip can be fabricated; it is whether a community-backed signer can reliably support the chosen protocol with understandable lifecycle and governance.

**Prototype components** (indicative, not a bill of materials or a purchase commitment):

| Component | Purpose | Selection question |
|---|---|---|
| Raspberry Pi or MCU host | Interface with sensor, network and signer | Can it queue offline and support secure updates? |
| Secure element evaluation kit | Non-exportable signing or key isolation | Which algorithms, attestation chain and firmware versions are verifiable? |
| Simulated energy meter | Repeatable software demonstration | Can a real calibrated sensor later replace it? |
| Local NodeJS adapter | Verify signatures, enforce mocked policy | Is it decoupled from vendor protocols? |
| Community admin interface | Approve devices and revoke authorisation | Who has authority, evidence and appeal rights? |

**TROPIC01** is a promising research candidate: Tropic Square publishes technical documentation, development boards, firmware and RTL resources. Its integration still requires detailed review of algorithms, provisioning, threat model and SDK capabilities. **OpenTitan** provides an open root-of-trust design and documentation for creator/owner attestation concepts. It is not a drop-in replacement for TROPIC01, and using either does not automatically confer hardware security on this demo.

## Chip design vocabulary

- **RTL:** behavioural hardware logic expressed in Verilog/SystemVerilog or similar languages.
- **PDK:** the foundry's process design kit with device models, design rules and layout constraints.
- **EDA flow:** tools for synthesis, placement, routing, extraction, timing and physical verification.
- **ASIC:** a fabricated application-specific chip, after design, validation, sign-off and packaging.
- **MPW:** shared multi-project wafer run, suitable for experimental circuits within constraints.

## Three stages

**Stage A — software:** reproduce signatures, hash-chain verification and community revocation tests on a laptop. Use this kit.

**Stage B — real secure hardware:** add a verified signer interface to a host with protected keys, secure provisioning, real firmware lifecycle and a sensor. Independently verify attestations where the hardware supports them.

**Stage C — open silicon:** evaluate an open RISC-V subsystem, suitable security IP and an open PDK such as SKY130 or GF180MCU. Begin with an educational event counter and basic bus logic. A hardened secure element requires professional review, resistance to physical attacks, secure entropy and process-specific assurance; a tiny tapeout does not demonstrate those properties.

## Signer interface contract proposal

```js
// Prototype-only shape, not an established selfdriven.network API
const signer = {
  publicKeySpki: 'base64url(DER SPKI)',
  deviceId: 'sdid:spki256:...',
  signerType: 'software-demo',
  sign(messageBytes) { /* return Buffer signature */ }
};
```

At the hardware migration point, isolate the signer as an asynchronous adapter if needed (`.then()`-friendly), and keep private keys off the host. Distinguish `sign()` success from attestation of firmware and from permission to cause effects.

## Custom silicon decision gate

A dedicated chip only becomes justified after a credible field pilot shows material constraints that cannot be met by existing secure elements or processors: power, cost at volume, tamper-resistance, supply-chain transparency, lifecycle controls or unique verifiable functionality. Until then, openness is better delivered at the **interface and verification** layers than by asserting an unvalidated custom security chip.
