# Core (Objects) Interface

* core.selfdriven.network  
* core.interface.selfdriven.network  
* objects.interface.selfdriven.network  
* api.slfdrvn.io

**Version**

2.3 (NOV2023)

**Methods**

* “get-learners”  
* ”get-learning-partners”  
* “get-connections”  
* “get-skills”  
* “add-skill”  
* “get-achievements”  
* “add-achievement”  
* “add-token”  
* “get-contacts-organisation”  
* “get-contacts-person”  
* “get-projects”  
* “add-community-member”  
  


**Notes**

* All methods are access as http POSTs  
* All data to be sent in the body as JSON \- so protected by SSL.  
* All response data returned as JSON.  
* All http response statuses are 200 with status=”OK|ER” \- REST/http status code version is coming.

**Help**

* [https://selfdriven.fyi/connect](https://selfdriven.fyi/connect)  
* [https://selfdriven.fyi/apps/\#apis](https://selfdriven.fyi/apps/#apis)

**Methods**

| Method | Get Learners (get-learners) |
| :---- | :---- |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘get-learners’ apikey: \[supplied\] authkey: \[supplied\] data: id: Learner ID firstname: lastname: email:  |
| **Format** | JSON |
| **Response Data** | method: ‘get-learners’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { firstname:, lastname:, email:  id:, etag: modifieddatetime:, createddatetime: } \] |

| Method | Get Connections (get-connections) |
| :---- | :---- |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘get-connections’ apikey: \[supplied\] authkey: \[supplied\] data: id: Learner or Learning-Partner  ID \-- leave blank for all.  |
| **Format** | JSON |
| **Response Data** | method: ‘get-learners status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { learnerfirstname:, learnerlastname:, learneremail: , learnerselfdrivenid:, selfdrivenid:, etag: modifieddatetime:, createddatetime: } \] |

| Method | Get Skills (get-skills) |
| :---- | :---- |
| **Mode** | Current set to “reflect” \- ie request is validated and all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘get-skills’ apikey: \[supplied\] authkey: \[supplied\] data: id: Skill ID \-- leave blank for all. skillname: \- leave blank for all.  |
| **Format** | JSON |
| **Response Data** | method: ‘get-skills’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: \[ { skillname:, assetname:, category, categorytext: notes:, sequencenumber:, email:  id:, etag: modifieddatetime:, createddatetime: } \] |

| Method | Add Achievement (add-achievement) |
| :---- | :---- |
| **Description** | Add achievement with linked skills. |
| **Mode** | Current set to “reflect” \- ie request is validated and  all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘add-achievement’ apikey: \[supplied\] authkey: \[supplied\] data: issuedto: ID as returned from get-learners date: D MMM YYYY subject: description: skills: \[{id:}\]  |
| **Format** | JSON |
| **Response Data** | method: ‘add-achievement’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: {id: …. } ids: { achievement:, ... } |

| Method | Add Token (add-token) |
| :---- | :---- |
| **Description** | Add community token. |
| **Mode** | Current set to “reflect” \- ie request is validated and  all data sent with request reflected back for integration development/testing. |
| **Reflect Options** | status: eg “OK”, “ER” data: Data to be reflected. |
| **Request Data** | method: ‘add-token’ apikey: \[supplied\] authkey: \[supplied\] data: issuedto: ID as returned from get-learners date: D MMM YYYY subject: notes: amount: type: ‘Earned’, ‘Used’, usage: ‘Community Services’ linkedto: \[{type: ‘Achievement’, id:}\]  |
| **Format** | JSON |
| **Response Data** | method: ‘add-token’ status: ‘OK’, ‘ER’ \- if error then {error: {code:, description:}} data: {id: …. } ids: { token:, ... } |

**Examples**

**https POST to the Request data as JSON to endpoint, e.g. api.slfdrvn.io**

**Get Learners**

| Request Mode \= Reflect | {     "apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1",     "authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2",     "mode":     {         "type": "live"     },     "data":     {        "firstname": "Kate"     }   }  |
| :---- | :---- |
| **Response** Mode \= Reflect | { 	"status": "OK", 	"apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1", 	"authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2", 	"mode": 	{ 		"type": "live" 	}, 	"data": 	\[ 		{ "firstname": "Jane", 	"lastname": "Smith", "email": "jane@email.com", "id": "6423c12c-58aa-476a-b4d4-9056d59b926c", 	"createddatetime": "01 OCT 2021 22:10:00", 	"modifieddatetime": "01 NOV 2021 23:10:00" 		} 	\] } |

**Add Achievement**

| Request Mode \= Reflect | {     "method": "add-achievement",     "apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1",     "authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2",     "mode":     {         "type": "live"     },     "data":     { "issuedto": "b2153e61-00fe-4aad-db27-de29920cf74e",  "date": "01 OCT 2021",  "subject": "Work in the canteen",  "description": "Work in the canteen for 1 year",  "skills":  \[ {id: ‘861af19d-a373-4e41-9790-aec13904e2af’}, {id: ‘2643e7b0-c77a-4c6d-a52c-5b0a2ad1f54a’} \]     } } |
| :---- | :---- |
| **Response** Mode \= Reflect | { 	"status": "OK", 	"apikey": "e7849d3a-d8a3-49c7-8b27-70b85047e0f1", 	"authkey": "28cc4fae-804f-4603-d08a-94fce2be90f2", 	"mode": 	{ 		"type": "live" 	}, 	"data": 	{ 		"id": “e4aec5ac-5587-4fe4-a4da-d00dc28d1690” 	} 	"ids": 	{ 		"log":"22050602-6134-4898-b984-26d4741ab2c5", 		"achievement":"e4aec5ac-5587-4fe4-a4da-d00dc28d1690" 	} } |

