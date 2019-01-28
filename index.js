const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

var port = process.env.port || 2000
var app = express({defaultErrorHandler:false});

app.use(cors())
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static('public'));

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'sena',
    password : 'haidar123',
    database : 'moviebertasbih',
    port : 3306
})

////////////////HOME//////////////////

app.get('/', (req,res) => {
    console.log('WELCOME TO API MOVIES')
    res.send("<h1><center>WELCOME TO API MOVIES</center></h1>")
})

////////////////List Film///////////

app.get('/listmovie', (req,res) => {
    var sql = `SELECT * from movies;`;
    conn.query(sql,(err,results) => {
        res.send(results);
    })
})

////////////////Kategori Film//////////

app.get('/listkategori', (req,res) => {
    var sql = `SELECT * from categories;`;
    conn.query(sql,(err,results) => {
        res.send(results);
    })
})

app.get('getbykategori/:nama', (req,res) => {
    var kategori = req.body;
    var sql = `select
    movies.nama as namaFilm,
    categories.nama as namaKategori
    from movies
    join movcat on movcat.idmovie = movies.id
    join categories on movcat.idcategory = categories.id
    where categories.nama like '%${kategori}%';`
    conn.query(sql,(err,results) => {
        res.send('pencarian berhasil!')
    })
})

///////////All Film With Connect Genres/////////

app.get('/allconnlist', (req,res) => {
    var sql = `select
    movies.nama as namaFilm,
    categories.nama as namaKategori
    from movies
    join movcat on movcat.idmovie = movies.id
    join categories on movcat.idcategory = categories.id;`;
    conn.query(sql,(err,results) => {
        res.send(results);
    })
})

////////////////Add new kategori///////////////////

app.post('/addkategori', (req,res) => {
    var sql = `insert into categories set ?;`;
    var data = req.body
    conn.query(sql, data, (err,results) => {
        res.send(results)
    })    
})

/////////////////Add new Movie///////////////////

app.post('/addmovie', (req,res) => {
    var sql = `insert into movies set ?;`;
    var data = req.body
    conn.query(sql, data, (err,results) => {
        res.send(results)
    })
})

//////////////////connection for Movie and Category//////////
///////////////// { "idmovies" : 'int', "idcategory": 'int'}

app.post('/addconnection', (req,res) => {
    var sql = `insert into movcat set ?;`;
    var data = req.body
    conn.query(sql, data, (err,results) => {
        res.send(results)
    })
})

/////////Edit???//////

app.post('/editmovie/:id', (req,res) => {
    var sql = `update movies set ? where id = ${req.params.id};`
    var data = req.body
    conn.query(sql,data, (err,results) => {
        res.send('berhasil dirubah')
    })
})

////////////delete, di sql bisa tapi di postman error/////////

app.post('/deletemovie/:id', (req,res) => {
    var sql =  `delete movcat from movcat 
    join movies on movcat.idmovie = movies.id
    join categories on movcat.idcategory = categories.id
    where movies.nama like '%${nama}%'  and categories.nama like '${nama}';`              
    conn.query(sql,(err,results) => {
        res.send('berhasil dihapus')
    })
})

app.post('/deletekategori/:id', (req,res) => {
    var sql = `delete categories.id from categories
    join movcat on movcat.idcategory = categories.id
    join movies on movies.id = categories.id
    where categories.id = ${req.params.id} and movies.id = ${req.params.id};`;
    conn.query(sql,(err,results) => {
        res.send('berhasil dihapus')
    })
})

app.post('/deleteconnlist/:id', (req,res) => {
    var sql = `delete from movcat where idmovie=${req.params.id};`;
    conn.query(sql,(err,result)=>{
        res.send(result)
        console.log(result)
    })
})


/////////////////////=[]=\\\\\\\\\\\\\\\\\\\\\\\

app.listen(port, () => console.log('API AKTIF DI PORT ' + port))