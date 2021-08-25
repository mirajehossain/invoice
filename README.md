# Invoice service

### Installation
```
 cd invoice-service
 npm i
```

### Run the project

To run the project `npm start`
url: `http://localhost:8000`


To run tests: `npm run test`


Run on Docker: `docker compose up --build`


***
     `/api/v1/*` API's are secured, to access those API, uer must have to logged in and  need to add bearer token in authorization header 
### Routes
``` 
- /api/auth
- /api/v1/users
```

### Endpoints
```
> /api/auth

- [POST] /api/auth/login
- [POST] /api/auth/reister

-------------------------------------------------------------
> /api/v1/users

- [GET] /api/v1/users
-------------------------------------------------------------

```
##### THANKS
