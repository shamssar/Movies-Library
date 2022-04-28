'use strict';


const express = require('express');
const cors = require("cors");
const axios = require('axios').default;

const dataJson = require("./data.json");
const port = 3000
const url = 'https://api.themoviedb.org/3/trending/all/week?api_key=832cef0f07230d4d9616526456183935';
const app = express();
app.use(cors());



// app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get ('/trending',handelTrending);
app.get("/search", handleSearch);




// function handleHomePage(req, res) {   
//     let newMovie = new movie(dataJson.title, dataJson.poster_path, dataJson.overview);
// res.json(newMovie);
// }
    

function handleFavorite(req, res) {
    res.send("Welcome to Favorite Page");
}
app.listen(port, handleListen);
function handleListen() {
    console.log(`Example app listening on port ${port}`);
}

function handelTrending(req,res){ 
    console.log(url);
     
      axios.get(url)
      .then((result) =>{
          console.log(result);
      
            let newArr =result.data.results.map(x => {return new Dataa(x.id,x.title,x.release_date,x.poster_path,x.overview)})
       res.json(newArr)
      
      }).catch((err)=>{
          console.log("error")
      })
  
  }


  function handleSearch(req, res) {
    let movieName = req.query.movieName; 
    console.log(req.query);
    

    let url = `https://api.themoviedb.org/3/search/movie?api_key=832cef0f07230d4d9616526456183935&language=en-us&query=${movieName}&page=2`;
    // let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-us&query=${movieName}&page=2`;

    
    axios.get(url)
        .then(result => {
            res.json(result.data.results)
        })
        .catch((err)=>{
            console.log("error")
        })


    }


    function Dataa(id, title, release_data, poster_path, overview) {
        this.id = id ,
        this.title = title,
        this.release_data= release_data,
        this.poster_path = poster_path,
        this.overview = overview
    }

