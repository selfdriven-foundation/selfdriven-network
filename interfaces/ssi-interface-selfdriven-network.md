# SSI Interface

* ssi.selfdriven.network  
* ssi.interface.selfdriven.network  
* ssi.api.slfdrvn.io

**Version**

- 2.5 (JAN2025)

**Methods**

* “ssi-get-info”  
* “ssi-generate-did-document”,  
* “ssi-generate-account”  
* “ssi-generate-verifiable-credential”  
* “ssi-get-did”  
* “ssi-get-did-conns”  
* “ssi-get-verifiable-presentations”

**Notes**

* All methods are access as http POSTs  
* All data to be sent in the body as JSON \- so protected by SSL.  
* All response data returned as JSON.  
* All http response statuses are 200 with status=”OK|ER” \- REST/http status code version is coming.

**Help**

* [https://selfdriven.fyi/connect](https://selfdriven.fyi/connect)  
* [https://selfdriven.fyi/apps/\#apis](https://selfdriven.fyi/apps/#apis)

**Methods**

| Method | Get Specs (ssi-get-info) |
| :---- | :---- |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘get-specs’ apikey: \[supplied\] authkey: \[supplied\] data: version:  |
| **Format** | JSON |
| **Response Data** | method: ‘ssi-get-info’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { } \] |

| Method | Get DIDs (ssi-generate-did-document) |
| :---- | :---- |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘ssi-generate-did-document’ apikey: \[supplied\] authkey: \[supplied\] data: id: DID \-- leave blank for all.  |
| **Format** | JSON |
| **Response Data** | method: ‘ssi-generate-did-document’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { firstname:, lastname:, email: , id:, etag: modifieddatetime:, createddatetime: } \] |

**Examples**

**https POST to the Request data as JSON to endpoint, e.g. ssi.api.slfdrvn.io**

**Get Specs**

| Request Mode \= Reflect | {     "apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1",     "authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2",     "mode":     {         "type": "live"     },     "data":     {        "version": "1"     }   }  |
| :---- | :---- |
| **Response** Mode \= Reflect | { 	"status": "OK", 	"apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1", 	"authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2", 	"mode": 	{ 		"type": "live" 	}, 	"data": 	\[ 		{ “name": "DID Schema 1.0", "id": "6423c12c-58aa-476a-b4d4-9056d59b926c", 	"createddatetime": "01 OCT 2023 22:10:00", 	"modifieddatetime": "01 NOV 2023 23:10:00" 		} 	\] } |

### Resources
- [Get Help, Log an Issue](https://github.com/selfdriven-foundation/selfdriven-network/issues)
- [selfdriven.network](https://selfdriven.network)  
- [selfdriven.id](https://selfdriven.id)  
