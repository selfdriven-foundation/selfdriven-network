## OnChain Interface

* onchain.selfdriven.network  
* onchain.interface.selfdriven.network  
* onchain.api.slfdrvn.io

**Version**

2.1 (JAN2025)

**Methods**

* “generate-mnemonic” (util function)  
* “generate-hash” (util function)  
* “verify-signed-data” (util function)  
* “generate-wallet” (aka “generate-address”)  
* “generate-account”  
  (like “generate-wallet” but mnemonic not returned, it is encrypted and stored)   
* “get-tokens”  
* “get-transactions”  
* “verify-user-auth”  
* “generate-transaction”  
* “verify-signed-data-policy”  
* “get-protocol-parameters”

**Notes**

* All methods are access as http POSTs  
* All data to be sent in the body as JSON \- so protected by SSL.  
* All response data returned as JSON.  
* All http response statuses are 200 with status=”OK|ER” \- REST/http status code version is coming.

**Help**

* [https://selfdriven.fyi/connect](https://selfdriven.fyi/connect)  
* [https://selfdriven.fyi/apps/\#apis](https://selfdriven.fyi/apps/#apis)

**Methods**

| Method | Generate Mnemonic (generate-mnemonic) |
| :---- | :---- |
| **Endpoints** | https://onchain.selfdriven.network https://onchain.api.slfdrvn.io |
| **Description** | Generates BIP39 word mnemonic |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘generate-mnemonic’ apikey: \[supplied\] authkey: \[supplied\] data: words: \[12, 15, 18, 21, 24\]  |
| **Format** | JSON |
| **Response Data** | method: ‘generate-mnemonic’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { mnemonic:, entropy: \] |

| Method | Generate Hash (generate-hash) |
| :---- | :---- |
| **Endpoints** | https://onchain.selfdriven.network https://onchain.api.slfdrvn.io |
| **Description** | Generates a BLAKE-2b Hash. |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘generate-hash’ apikey: \[supplied\] authkey: \[supplied\] data: text: \[text to hash\] hashlength: \[default 256\] bytes: \[default 32 or hashlength / 8\]  |
| **Format** | JSON |
| **Response Data** | method: ‘generate-hash’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { hashedtexthex: \] |

| Method | Verify Signed Data (verify-signed-data) |
| :---- | :---- |
| **Endpoints** | https://onchain.selfdriven.network https://onchain.api.slfdrvn.io |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘verify-signed-data’ apikey: \[supplied\] authkey: \[supplied\] data: datatoverify: signature: key: \[optional\] stakeaddress: \[optional\]  |
| **Format** | JSON |
| **Response Data** | method: ‘verify-signed-data’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { dataverified: \[true, false \] |

| Method | Generate Wallet (generate-wallet) |
| :---- | :---- |
| **Endpoints** | https://onchain.selfdriven.network https://onchain.api.slfdrvn.io |
| **Description** | Generate a new “wallet”. |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘generate-wallet’ apikey: \[supplied\] authkey: \[supplied\] data: mnemonic: \[optional, generated if not supplied\] entropy: \[optional, generated if not supplied\]  |
| **Format** | JSON |
| **Response Data** | method: ‘generate-wallet’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { mnemonic:, entropy:, keys:, addresses: \] |

| Method | Generate Account (generate-account) |
| :---- | :---- |
| **Endpoints** | https://onchain.selfdriven.network https://onchain.api.slfdrvn.io |
| **Description** | Generate a new “account” \- which is same as “generate-wallet” except stores the mnemonic, entropy, keys privately on selfdriven.cloud service in the context of the user generating the account. The account is thus shared custody. |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘generate-account’ apikey: \[supplied\] authkey: \[supplied\] data: mnemonic: \[optional, generated if not supplied\] entropy: \[optional, generated if not supplied\]  |
| **Format** | JSON |
| **Response Data** | method: ‘generate-account’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { addresses: \] |

| Method | Get Tokens (get-tokens) |
| :---- | :---- |
| **Endpoints** | https://onchain.selfdriven.network https://onchain.api.slfdrvn.io |
| **Description** | Get tokens for an address using an indexing service. Can be used by the cloud service to access data for a user's account/address. |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘generate-account’ apikey: \[supplied\] authkey: \[supplied\] data: address:   |
| **Format** | JSON |
| **Response Data** | method: ‘generate-account’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { tokens: \] |

| Method | Get Transactions (get-transactions) |
| :---- | :---- |
| **Endpoints** | https://onchain.selfdriven.network https://onchain.api.slfdrvn.io |
| **Description** | Get transactions (UTxOs) for an address using an indexing service. Can be used by the cloud service to access data for a user's account/address. |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘generate-account’ apikey: \[supplied\] authkey: \[supplied\] data: address:   |
| **Format** | JSON |
| **Response Data** | method: ‘generate-account’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { transactions: \] |

**Examples**

**https POST to the Request data as JSON to endpoint, e.g. onchain.slfdrvn.io**

**Generate Mnemonic**

| Request Mode \= Reflect | {     "apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1",     "authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2",     "mode":     {         "type": "live"     },     "data":     {        "words": "24"     }   }  |
| :---- | :---- |
| **Response** Mode \= Reflect | { 	"status": "OK", 	"apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1", 	"authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2", 	"mode": 	{ 		"type": "live" 	}, 	"data": 	\[ 		{ "mnemonic": ""		                 } 	\] } |

