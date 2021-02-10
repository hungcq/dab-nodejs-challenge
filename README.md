# dab-nodejs-challenge

**dab-nodejs-challenge** is a project to solve entry challenge of my application to DAB.

The project is implemented using NodeJS, ExpressJS, Kafka and Couchbase 6.6.

## How to run it locally


1. Install NodeJS.
2. Install the required Node packages.
```bash
npm i
```
3. Open a terminal, navigate to the project root directory.
4. Run the **index.js** scripts in **product-service** and 
   **log-service** directories, with environment variables:
   - **ip** set to the ip which are sent with the **email**
   - **pass** set to the password which are sent with the **email**
```bash
pass=[password] ip=[ip] node product-service/index.js
pass=[password] ip=[ip] node log-service/index.js
```
5. *(Optional)* Run test:
```bash
cd product-service
npm run test
```
```bash
cd log-service
npm run test
```
*Note*: the database and message broker (kafka) has been deployed
on cloud:
- **ip** environment variable is used to point to the server IP.
- **pass** environment variable is used to access the database.

## Structure and Diagrams

### [High level components diagram](https://images-1918.s3.ap-southeast-1.amazonaws.com/Component%20Diagram0.png)

### [Search product sequence diagram](https://images-1918.s3.ap-southeast-1.amazonaws.com/Search%20Product%20Sequence%20Diagram0.png)

### [Database entity diagram](https://images-1918.s3.ap-southeast-1.amazonaws.com/Entity%20Diagram.png)

### Software development patterns
Ports-adapters Architecture

Each service is divided into 2 main parts:
- /core: containing business logic
- /entries: entry/exit point into and out of the application,
including: database, rest-apis and kafka
### CURL commands to verify the APIs
#### Get Products
```bash
curl --location --request GET 'localhost:3000/products'
```

#### Search Products
```bash
curl --location --request GET 'localhost:3000/products?minPrice=0&maxPrice=5&type=A&name=A1'
```

#### Get Product (View Product Details)
```bash
curl --location --request GET 'localhost:3000/products/4'
```

#### Add Product
```bash
curl --location --request POST 'localhost:3000/products' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "skin care","type": "health","price": 20}'
```

#### Get Actions
```bash
curl --location --request GET 'localhost:3001/actions'
```
