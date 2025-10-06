---
layout: default
title: AI Interface - selfdriven Network
permalink: /ai-interface/
---

# AI Interface

The selfdriven AI Interface provides a unified interface for accessing, orchestrating, and extending AI-driven capabilities across the **selfdriven.network** ecosystem.

It serves as the foundational layer that connects human identity, community context, and intelligence through a consistent, secure, and verifiable surface.

The Interface exposes a suite of methods for managing models, agents, conversations, vector stores, and assistants.  

Each method is accessed via authenticated HTTP POST requests, with all request and response data transmitted as JSON over SSL for privacy and integrity.

By aligning with the **Progressive Self-Actuation Framework**, the Interface enables communities, organisations, and practitioners to embed AI within trusted, context-aware environments — where every interaction is authenticated, auditable, and human-aligned.

The Interface supports all widely recognised foundation models and integrates with OpenRouter to provide access to specialised models.

---

**Version:**
- 2.3 (August 2025)

**Endpoints:**  
- ai.interface.selfdriven.network
- ai.api.slfdrvn.io

### Core Methods

| Category | Method | Description |
|:-----------|:---------|:-------------|
| **Models** | ai-gen-get-models | Retrieve available AI model specifications. |
| **Agents** | ai-gen-get-agents | List or describe active conversational agents. |
| **Conversation** | ai-gen-conversation-chat, ai-gen-chat | Initiate or manage AI conversation threads. |
| **Vector Stores** | ai-gen-util-vector-store-create, ai-gen-util-vector-store-attach-file, ai-gen-util-vector-stores | Create and manage contextual knowledge bases. |
| **Files** | ai-gen-util-file-upload, ai-gen-util-file-base64-upload, ai-gen-util-files | Securely upload and manage files for embedding or reference. |
| **Assistants** | ai-gen-util-assistant-create, ai-gen-util-assistants | Define and manage assistant configurations. |
| **Threads** | ai-gen-util-thread-create, ai-gen-util-thread-chat | Manage conversational threads for context continuity. |
| **Utilities** | ai-gen-util-service-models | Access underlying AI service metadata. |


### Protocol Overview

- All methods use HTTP POST.  
- Requests and responses use application/json format.  
- All communications are protected via SSL/TLS.  
- Standard HTTP status: 200 OK  
- Internal status field: "status": "OK" or "ER"  
- All responses contain a "method" and "data" object for structured integration.


### Example

**Endpoint:** https://ai.interface.selfdriven.network  
**Method:** ai-gen-get-models  

**Request:**
<pre><code class="language-json">
{
  "apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1",
  "authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2",
  "mode": { "type": "live" },
  "data": { "version": "1" }
}
</code></pre>

-----

**Methods**

- ai-gen-get-models
- ai-gen-get-agents
- ai-gen-conversation-chat
- ai-gen-chat
- ai-gen-util-service-models
- ai-gen-util-vector-store-create
- ai-gen-util-vector-stores
- ai-gen-util-vector-store-attach-file
- ai-gen-util-file-upload
- ai-gen-util-file-base64-upload
- ai-gen-util-files
- ai-gen-util-assistant-create
- ai-gen-util-assistants
- ai-gen-util-thread-create
- ai-gen-util-thread-chat

**Notes**

* All methods are access as http POSTs  
* All data to be sent in the body as JSON \- so protected by SSL.  
* All response data returned as JSON.  
* All http response statuses are 200 with status=”OK,ER”.

## Methods

### Get Models (ai-gen-get-models)
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘get-specs’ apikey: \[supplied\] authkey: \[supplied\] data: version:  |
| **Format** | JSON |
| **Response Data** | method: ‘ai-gen-get-models’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { name:, url:, id:, etag: modifieddatetime:, createddatetime: } \] |


# Conversation Chat (ai-gen-conversation-chat)
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘ai-gen-conversation-chat’ apikey: \[supplied\] authkey: \[supplied\] data: messagesystem: message: |
| **Format** | JSON |
| **Response Data** | method: ‘ai-gen-conversation-chat’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { firstname:, lastname:, email: , id:, etag: modifieddatetime:, createddatetime: } \]|

### Resources
- [Get Help, Log an Issue](https://github.com/selfdriven-foundation/selfdriven-network/issues)
- [selfdriven.network](https://selfdriven.network)  
- [selfdriven.ai](https://selfdriven.ai)
- [Code GitHub Repo](https://github.com/selfdriven-tech/interface-ai)
