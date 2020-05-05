const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:vncssj1622@cluster0-6nqqr.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var app = express()

const ObjectId = require('mongodb').ObjectID


app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.set('views', './src/views/');

app.get('/', (req, res) => {
    client.connect(err => {
        const collection = client.db("crud").collection("users");
        // perform actions on the collection object
        collection.find().toArray((err, results) => {
            if (err) return console.log(err)
            res.render('index.ejs', { users: results })
        })
    });
})

app.get('/add', (req, res) => {
    client.connect(err => {
        const collection = client.db("crud").collection("users");
        // perform actions on the collection object
        collection.find().toArray((err, results) => {
            if (err) return console.log(err)
            res.render('add.ejs', { users: results })
        })
    });
})

app.post('/add', (req, res) => {
    client.connect(err => {
        const collection = client.db("crud").collection("users");

        collection.insertOne(req.body, function (err, res) {
            if (err) throw err;
            console.log("User was added");
        });
        res.redirect('/')
    });
})

function cleanup() {
    client.close();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

app.listen(3000, () => {
    console.log("Server started")
});