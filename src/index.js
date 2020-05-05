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

client.connect(err => {
    collection = client.db("crud").collection("users");
})

app.get('/', (req, res) => {
    collection.find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('index.ejs', { users: results })
    })
})

// ADD USER
app.get('/add', (req, res) => {
    collection.find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('add.ejs', { users: results })
    })
})

app.post('/add', (req, res) => {
    collection.insertOne(req.body, function (err, res) {
        if (err) throw err;
        console.log("User was added");
    });
    res.redirect('/')
})
// END - ADD USER

// EDIT USER
app.get('/edit/:id', (req, res) => {

    var id = req.params.id

    collection.find(ObjectId(id)).toArray((err, results) => {
        if (err) return console.log(err)
        res.render('edit.ejs', { user: results })
    })
})
app.post('/edit/', (req, res) => {

    var data = req.body;
    var id = data.id
    delete data.id;

    collection.updateOne({ _id: ObjectId(id) }, { $set: data },
        ((err, results) => {
            if (err) return console.log(err)
            res.redirect('/')
            console.log('User was updated')
        })
    )
})
// END - EDIT USER

// DELETE USER
app.get('/delete/:id', (req, res) => {

    var id = req.params.id

    collection.deleteOne({ _id: ObjectId(id) },
        ((err, results) => {
            if (err) return console.log(err)
            res.redirect('/')
            console.log('User was deleted')
        })
    )
})
// END - DELETE USER


function cleanup() {
    client.close();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

app.listen(3000, () => {
    console.log("Server started")
});