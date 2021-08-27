# Invoice service

### Installation
```
 cd invoice-service
 npm install
```

### Run the project
Before run: copy `.env.example` to 	`.env`

To run the project `npm start`
Local url: `http://localhost:8000`
GraphQL url: `http://localhost:8000/graphql`

Run on Docker: `docker compose up --build`

To run tests: `npm run test`


     `/api/v1/*` API's are secured, to access those API, uer must have to logged using google oauth provider 


### get users
```shell
method: get
url: http://localhost:8000/api/v1/users
body: n/a
query: {
  page: 1,
  limit: 10,
  userType: 'user' // user,customer
}
response: {
	"success": true,
	"count": 202,
	"data": [{
		"_id": "6128c92f875d6ac3638f5341",
		"userType": [
			"user", "customer"
		],
		"google_id": "106487786449698246092",
		"name": "John Doe",
		"image": "https://lh3.googleusercontent.com/a-/AOh14Gjd0OK9MxPtWbh3bOitIAweDYmCWr4BzKyotdJX=s96-c",
		"email": "john.doe@gmail.com",
		"created_at": "2021-08-27T11:14:55.456Z",
		"updated_at": "2021-08-27T11:14:55.456Z"
	}]
}

```



## invoice module
### create invoice:
```shell
method: post
url: http://localhost:8000/api/v1/invoices
body: {
	"contact_number": "01922334455",
	"address": "Mirpur",
	"items": [
		{"name": "Ice cream", "quantity": 5, "price": 40}
	]
}
query: n/a
response: {
  "success": true,
  "data": {
    "_id": "61269637380116c20c2f7980",
    "user_id": "6126961e380116c20c2f7972",
    "address": "Mirpur",
    "contact_number": "01922334455",
    "status": "pending",
    "total": 200,
    "invoice_no": "INV1629918775680",
    "created_at": "2021-08-25T19:12:55.682Z",
    "updated_at": "2021-08-25T19:12:55.682Z"
  }
}

```

### get invoices:
```shell
method: get
url: http://localhost:8000/api/v1/invoices
body: n/a
query: {
  page: 1,
  limit: 10,
  invoiceNo: 'INV1629918775680'
}
response: {
	"success": true,
	"message": "Invoices",
	"data": [{
		"_id": "6129361d8f885abb20b3193b",
		"user_id": "612654eb198be44d47d5cec4",
		"address": "Mirpur DOHS",
		"contact_number": "01922334455",
		"status": "pending",
		"total": 220,
		"invoice_no": "INV1630090781764",
		"created_at": "2021-08-27T18:59:41.770Z",
		"updated_at": "2021-08-27T18:59:41.770Z",
		"invoice_items": [{
				"_id": "6129361d8f885abb20b3193d",
				"name": "Ice cream",
				"quantity": 5,
				"price": 40,
				"invoice_no": "INV1630090781764",
				"created_at": "2021-08-27T18:59:41.776Z",
				"updated_at": "2021-08-27T18:59:41.776Z"
			},
			{
				"_id": "6129361d8f885abb20b3193e",
				"name": "Pen",
				"quantity": 2,
				"price": 10,
				"invoice_no": "INV1630090781764",
				"created_at": "2021-08-27T18:59:41.776Z",
				"updated_at": "2021-08-27T18:59:41.776Z"
			}
		],
		"user": {
			"_id": "612654eb198be44d47d5cec4",
			"userType": [
				"user",
				"customer"
			],
			"name": "miraje hossain",
			"created_at": "2021-08-27T18:59:41.780Z"
			"updated_at": "2021-08-27T18:59:41.780Z"
		}
	}],
	"count": 85
}

```
### get invoice details:
```shell
method: get
url: http://localhost:8000/api/v1/invoices/:invoice_no
body: n/a
query: n/a
response: {
	"success": true,
	"message": "Invoice details",
	"data": {
		"_id": "6129361d8f885abb20b3193b",
		"user_id": "612654eb198be44d47d5cec4",
		"address": "Mirpur DOHS",
		"contact_number": "01922334455",
		"status": "pending",
		"total": 220,
		"invoice_no": "INV1630090781764",
		"created_at": "2021-08-27T18:59:41.770Z",
		"updated_at": "2021-08-27T18:59:41.770Z",
		"invoice_items": [{
				"_id": "6129361d8f885abb20b3193d",
				"name": "Ice cream",
				"quantity": 5,
				"price": 40,
				"invoice_no": "INV1630090781764",
				"created_at": "2021-08-27T18:59:41.776Z",
				"updated_at": "2021-08-27T18:59:41.776Z"
			},
			{
				"_id": "6129361d8f885abb20b3193e",
				"name": "Pen",
				"quantity": 2,
				"price": 10,
				"invoice_no": "INV1630090781764",
				"created_at": "2021-08-27T18:59:41.776Z",
				"updated_at": "2021-08-27T18:59:41.776Z"
			}
		],
		"user": {
			"_id": "612654eb198be44d47d5cec4",
			"userType": [
				"user",
				"customer"
			],
			"name": "miraje hossain",
			"created_at": "2021-08-25T14:34:19.055Z",
			"updated_at": "2021-08-27T18:59:41.780Z"
		}
	}
}

```


##### THANKS
