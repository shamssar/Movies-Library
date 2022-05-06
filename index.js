'use strict';
const pass = process.env.pass_KEY
const url = `postgres://student:${pass}@localhost:5432/demo2`

const PORT = 3000

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config();

const { Client } = require('pg')
const client = new Client(url)
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/addMovie',handleAdd);
app.get('/getMovie',handleGet);

 app.use(handleServerError);


function handleAdd (request,response){
    const { title, release_data, poster_path,overview } = request.body;
    let sql = `INSERT INTO  movies(title,release_data,poster_path,overview) VALUES($1,$2,$3,$4) RETURNING *`;
    let values = [title, release_data, poster_path,overview];

    client.query(sql, values).then((result) => {
        console.log(result.rows);
        return response.status(201).json(result.rows[0]);
    }).catch()
}

function handleGet (request,response){
    let sql = 'SELECT * from movies;'
    client.query(sql).then((result) => {
        console.log(result);
        response.json(result.rows);
    }).catch((err) => {
         handleServerError(err,request,response);
     });
}

 function handleServerError(error, request, res) {
     res.status(500).send(error)
 }

client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
})
