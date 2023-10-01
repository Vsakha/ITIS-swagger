var express = require('express');
var cors = require('cors')
var mariadb = require('mariadb');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
var app = express();
var port = 3000;

const options = {
    definition: {
        info: {
            title : 'Swagger API demo',
            version: '1.0.0',
            description: 'my demo'
        }
    },
    apis: ['server.js']
}

var pool = 
  mariadb.createPool({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'sample',
    port : 3306,
    connectionLimit : 5    
  });

const swaggerSpec = swaggerJSDoc(options);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


//Routes

/**
 * @swagger
 * /agents:
 *  get:
 *      description: List all the available agents in the api
 *      responses: 
 *          '200':
 *              description: A successful response
 */

app.get('/agents',cors(),async(req,res)=>{

var conn;
try{
conn = await pool.getConnection();
rows = await conn.query("select * from agents");
console.log(rows);
res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /customers:
 *  get:
 *      description: List all the available customers in the API 
 *      responses: 
 *          '200':
 *              description: A successful response
 */

app.get('/customers',async(req,res) =>{

var conn;
try{
conn = await pool.getConnection();
rows = await conn.query("select * from customer");
console.log(rows);
res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /companies:
 *  get:
 *      description: List all the available companies in the API 
 *      responses: 
 *          '200':
 *              description: A successful response
 */

app.get('/companies',async(req,res) =>{

var conn;
try{
conn = await pool.getConnection();
var rows = await conn.query("select * from company");
console.log(rows);
res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /companies/{id}:
 *  delete:
 *      tags:
 *         - Delete by ID
 *      description: Delete by id
 *      parameters:
 *          - name: id
 *            description: provide an id to delete the entire record
 *            in: path
 *            type: integer
 *            required: true
 *      responses: 
 *          '200':
 *              description: A successful response
 */

app.delete('/companies/:id',async(req,res)=>{
try{
	var id = req.params.id;
	conn = await pool.getConnection();
	rows = await conn.query("delete from company where COMPANY_ID = ?",[id]);
	console.log(rows);
	res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});


/**
 * @swagger
 * /companies:
 *  post:
 *      description: Post to create a new entry in the customer table
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  city:   
 *                    type: string
 *              required:
 *                  - city
 *                  - id
 *                  - name
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.post('/companies',async(req,res)=>{
var conn;
const id = req.body.id;
const name = req.body.name;
const city = req.body.city;
console.log(req.body);
try{
        conn = await pool.getConnection();       
        rows = await conn.query("insert into company (COMPANY_ID,COMPANY_NAME,COMPANY_CITY) values (?,?,?)" ,[id,name,city]);
        console.log(rows);
        res.send(rows);

throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /companies/{id}:
 *  put:
 *      tags:
 *         - PUT Operation
 *      description: put by id
 *      parameters:
 *          - name: id
 *            description: provide and id and change the value of the city you want to update
 *            in: path
 *            type: integer
 *            required: true
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema: 
 *              type: object
 *              properties:
 *                  city:
 *                      type: string
 *              required:
 *                  -city
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.put('/companies/:id',async(req,res)=>{
var conn;
try{
console.log(req.body.city);        
console.log(req.params.id);
const id = req.params.id;
	const bodyval = req.body.city;
        conn = await pool.getConnection();       
        rows = await conn.query("update company set COMPANY_CITY = ? where COMPANY_ID = ?",[bodyval,id]);
        console.log(rows);
        res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});

/**
 * @swagger
 * /companies/{id}:
 *  patch:
 *      tags:
 *         - Patch Operation
 *      description: patch option on the company where you can provide the id to modify the city name
 *      parameters:
 *          - name: id
 *            description: id to update by
 *            in: path
 *            type: integer
 *            required: true
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema: 
 *              type: object
 *              properties:
 *                  city:
 *                      type: string
 *              required:
 *                  -city
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.patch('/companies/:id',async(req,res)=>{
var conn;
try{
console.log(req.body.city);
console.log(req.params.id);
const id = req.params.id;
        const bodyval = req.body.city;
        conn = await pool.getConnection();
        rows = await conn.query("update company set COMPANY_CITY = ? where COMPANY_ID = ?",[bodyval,id]);
        console.log(rows);
        res.send(rows);
}
catch(e){
throw e;
}finally{
if(conn){
return conn.end();
}
}
});


app.listen(port,()=>{
console.log("listening on port 3000");
});
