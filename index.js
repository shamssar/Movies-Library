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
app.put ('/update/:id',UpdateMovie);
app.delete('/delete/:id',DeleteMovie);
app.get('/getMovie/:id',GetMovieId);


//  app.use(handleServerError);



function handleAdd (request,response){
    const {id, title, release_data, poster_path,overview } = request.body;
    let sql = `INSERT INTO  movies(id,title,release_data,poster_path,overview) VALUES($1,$2,$3,$4,$5) RETURNING *`;
    let values = [id,title, release_data, poster_path,overview];

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
    }).catch(error => {
        console.log(error);
    });
}


function UpdateMovie (request,response){

    const id = request.params.id;
    const {title, release_data, poster_path,overview } = request.body;
    const sql = `UPDATE movies 
    SET title=$2,release_data=$3, poster_path=$4, overview=$5
    WHERE id = $1 RETURNING *;`;
    let values = [id,title,release_data,poster_path,overview]; 
    client.query (sql,values).then(data=>{
        response.json(data.rows[0]);
    }).catch(error => {
        console.log(error);
    });
} 


function DeleteMovie(request,response){
    const id = request.params.id;

    const sql = `DELETE FROM movies WHERE id=${id};`; 
    client.query(sql).then(()=>{
        response.status(200).json("deleted");
    }).catch(error => {
        console.log(error);
    });
}


function GetMovieId (request,response){
    const id = request.params.id;

    const sql = `SELECT * FROM movies WHERE id=${id};`;
    client.query(sql).then(data=>{
        response.status(200).json(data.rows)
        }).catch(error => {
            console.log(error);
        });
}

//  function handleServerError(error, request, response) {
//      response.status(500).send(error)
//  }

client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
})

