# AI Interface

* ai.selfdriven.network  
* ai.interface.selfdriven.network  
* ai.api.slfdrvn.io

**Version**

- 2.1 (FEB2025)

**Methods**

* “ai-gen-get-models”  
* “ai-gen-conversation-chat”  
* “ai-gen-chat”

**Notes**

* All methods are access as http POSTs  
* All data to be sent in the body as JSON \- so protected by SSL.  
* All response data returned as JSON.  
* All http response statuses are 200 with status=”OK|ER” \- REST/http status code version is coming.


**Methods**

| Method | Get Models (ai-gen-get-models) |
| :---- | :---- |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘get-specs’ apikey: \[supplied\] authkey: \[supplied\] data: version:  |
| **Format** | JSON |
| **Response Data** | method: ‘ai-gen-get-models’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { name:, url:, id:, etag: modifieddatetime:, createddatetime: } \] |

| Method | Conversation (ai-gen-conversation-chat) |
| :---- | :---- |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘ai-gen-conversation-chat’ apikey: \[supplied\] authkey: \[supplied\] data: messagesystem: message: |
| **Format** | JSON |
| **Response Data** | method: ‘ai-gen-conversation-chat’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { firstname:, lastname:, email: , id:, etag: modifieddatetime:, createddatetime: } \] |

**Examples**

**https POST to the Request data as JSON to endpoint, e.g. ai.api.slfdrvn.io**

**Get Models**

| Request Mode \= Reflect | {     "apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1",     "authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2",     "mode":     {         "type": "live"     },     "data":     {        "version": "1"     }   }  |
| :---- | :---- |
| **Response** Mode \= Reflect | { 	"status": "OK", 	"apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1", 	"authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2", 	"mode": 	{ 		"type": "live" 	}, 	"data": 	\[ 		{ “name": "gpt-4o" 		} 	\] } |

### Resources
- [Get Help, Log an Issue](https://github.com/selfdriven-foundation/selfdriven-network/issues)
- [selfdriven.network](https://selfdriven.network)  
- [selfdriven.ai](https://selfdriven.ai)  