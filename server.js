'use strict';
require('dotenv').config();
const pass = process.env.pass_KEY
const url = `postgres://student:${pass}@localhost:5432/demo2`
const apiKey= process.env.APIKEY; 

const dataJson = require("./data.json");
const axios = require('axios').default;

const port = process.env.PORT
console.log(port);

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const { Client } = require('pg')
// const client = new Client(url)
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
 });
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get("/", handleHomePage);
app.get ('/trending',handelTrending);
app.get("/favorite", handleFavorite);
app.post('/addMovie',handleAdd);
app.get('/getMovie',handleGet);
app.put ('/update/:id',UpdateMovie);
app.delete('/delete/:id',DeleteMovie);
app.get('/getMovie/:id',GetMovieId);
//  app.use(handleServerError);

function handleHomePage(req, res) {   
       let newMovie = new movie(dataJson.title, dataJson.poster_path, dataJson.overview);
     res.json(newMovie);
     }

     function handelTrending(req,res){ 
     let url=`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`
    
         
          axios.get(url)
          .then(result => {
            let recipes = result.data.results.map(movie => {
                return new Dataa(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            });
            res.json(recipes);
        
          }).catch((error) =>  {
            handleServerError(error, request, response);
        });
   }
      
function handleFavorite(req, res) {
    res.send("Welcome to Favorite Page");
}
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

function movie(title,poster_path,overview){
    this.title=title,
    this.poster_path=poster_path,
    this.overview=overview
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

function handleServerError(error, request, response) {
      response.status(500).send(error)
  }

client.connect().then(() => {

    app.listen(port, () => {
        console.log(`Server is listening ${port}`);
    });
})

function Dataa(id, title, release_data, poster_path, overview) {
    this.id = id ,
    this.title = title,
    this.release_data= release_data,
    this.poster_path = poster_path,
    this.overview = overview
}
