const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
require('dotenv').config()

let db,
        dbConnectionStr = process.env.DB_STRING,
        dbName = 'qwl'

    MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
                .then(client => {
                    console.log(`Connected to ${dbName} database.`)
                    db = client.db(dbName)
                })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())


app.get('/', (req, res)=> {
    db.collection('quotes').find().sort({likes: -1}).toArray()
    .then(data => {
        res.render('index.ejs', {info: data})
    })
    .catch(error=> console.error(error))
})

app.post('/addQuote', (req,res)=> {
    db.collection('quotes').insertOne({arQuote: req.body.arQuote, enQuote: req.body.enQuote, likes: 0})
    .then(result =>{
        console.log(`Quote Added`)
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/addOneLike', (req,res)=> {
    db.collection('quotes').updateOne({arQuote: req.body.arQuoteL, enQuote: req.body.enQuoteL, likes: body.likesL},{
        $set: {
            likes:req.body.likesL + 1
        }
    },{
        sort: {_id: 1},
        upsert: true
    })
    .then(result => {
        console.log(`Added One Like`)
        res.json('Like Added')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteQuote', (req,res)=> {
    db.collection('quotes').deleteOne({arQuote: req.body.arQuoteL})
    .then(result => {
        console.log(`Quote Deleted`)
        res.json('Quote Deleted')
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, ()=> {
    console.log(`Server Running On Port ${PORT}`)
})