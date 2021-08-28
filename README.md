# Invoice service

### Installation
```
 cd invoice
 npm install
```

### Run the project
Before run: copy `.env.example` to 	`.env`

To run the project `npm start`

Local url: `http://localhost:8000`

GraphQL url: `http://localhost:8000/graphql`

Run on Docker: 
- `first, we should update the url in .env DB_URL=mongodb://mongo:27017/invoice-service`
- `docker compose up --build`



To run tests: `npm run test`


     `/api/v1/*` API's are secured, to access those API, user must have to logged using google oauth provider 


For data seeding
- `npm run seed:user`
- `npm run seed:invoice`

### Auth
```shell
url: http://localhost:8000/auth/google
description: url for authentication using google oauth2
```

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


### update invoice:
```shell
method: patch
url: http://localhost:8000/api/v1/invoices/:invoice_no
body: {
	status: 'pending/processing/shipped/delivered/canceled',
	address: 'mirpur DOHS',
	contact_number: '01922334455'
	
}
query: n/a
response: {
	"success": true,
	"message": "invoice updated successfully",
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
	}
}

```
----------------------------------------------

# graphql

```shell

# get users
query {
  uesrs: userMany(skip:0, limit:1, filter: {email:"mdalamin8521@gmail.com"}) {
    _id
    name
    google_id
    email
    userType
    image
    updated_at
    created_at
  }


# create invoice
mutation {
    invoiceCreateOne(record: {
    user_id:"6128c6ccca6775bdb2c83916",
    address: "Dhaka", 
    contact_number:"01922334455", 
    status:"pending", 
    total: 500
    }) {
    
   recordId
   record {
      invoice_no
      contact_number
      address
      status
      total
      updated_at
      created_at
    }
  }
}




# create invoice items
mutation {
  invoiceItemCreateMany(records: [
    {name: "Ice cream", quantity: 5, price: 100, invoice_no: "ENV1630096496122"}
  ]) {
   recordIds 
  }
}


# get invoices
query {
  invoices: invoiceMany(skip:0, limit:1){
    total
    invoice_no
    status
    address
    contact_number
    user_id
    user: invoiceUser {
      name
      google_id
  		email
      userType
      image
      updated_at
      created_at
    }
    items:invoiceDetails {
      name
      quantity
      price
      updated_at
      created_at
    }
  }
}




# get invoice by invoice no
query {
  invoice: invoiceOne(filter: {invoice_no:"INV1630096035268"}) {
    total
    invoice_no
    status
    address
    contact_number
    user_id
    user: invoiceUser {
      name
      google_id
  		email
      userType
      image
      updated_at
      created_at
    }
    items:invoiceDetails {
      name
      quantity
      price
      updated_at
      created_at
    }
  }
}


# update invoice
mutation {
  invoiceUpdateOne(filter: {invoice_no: "INV1630096035268"}, record:{status: "processing"}) {
		record {
		  invoice_no
		  contact_number
		  address
		  status
		  total
		  updated_at
		  created_at
		}
  }
}

# invoice summary
query {
  summary: invoiceSummary{
    date
    total_invoice_count
    users {
      invoice_count
    	user {
    	  name
    	  userType
    	  email
    	  google_id
    	}
    }
  }
}


```




------------------------------------------------------------------------------
------------------------------------------------------------------------------

There is a requirement which is I need to create 4 different collections `(users, customers, invoices, invoice_items)`.
But, I create three `(users, invoices, invoice_items)` Why I do that?

It seems the `customers` collection is only used for if any user create any invoice/s then a new customer will create if not exists in `customers` collection.

For this reason, I think the better way is to add a `userType` field in the `users` collection, so that we can add tags like `user/customer` into `userType`. 
By default, every user has default `userType` which is `user`.

For any kind of customer-related query, we can get it from users collection by using `userType` column.

##### THANKS
