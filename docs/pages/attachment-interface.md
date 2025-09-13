---
layout: default
title: Attachment Interface - selfdriven Network
permalink: /attachment-interface/
---

# Attachment Interface

> Where attachments are created & controlled.

- attachment.selfdriven.network  
- attachment.interface.selfdriven.network  

### Version

- 2.0 (MAR2025)

### Method Names

- "attachment-ipfs-file-upload" 

### Notes

- All methods are access as http POSTs  
- All data to be sent in the body as JSON \- so protected by SSL.  
- All response data returned as JSON.  
- All http response statuses are 200 with status=”OK,ER”.

### Methods

| Method | Attachment IPFS File  Upload |
| :---- | :---- |
| **Name** | attachment-ipfs-file-upload |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘attachment-ipfs-file-upload’ apikey: \[supplied\] authkey: \[supplied\] data: version:  |
| **Format** | JSON |
| **Response Data** | method: ‘attachment-ipfs-file-upload’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { name:, url:, id:, etag: modifieddatetime:, createddatetime: } \] |

### Resources
- [Get Help, Log an Issue](https://github.com/selfdriven-foundation/selfdriven-network/issues)  
- [github.com/ibcom-lab/entityos-learn](https://github.com/ibcom-lab/entityos-learn)
- [github.com/ibcom-lab/entityos-learn-storage](https://github.com/ibcom-lab/entityos-learn-storage)
- [Code GitHub Repo](https://github.com/selfdriven-tech/interface-attachment)

---

- "Keep your attachments close."
- "Keep your attachments private, unless you choose not to."

