const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId


const app = express();
const port = process.env.PORT || 5000;

// middleware-----
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzjok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        console.log('data base connected successfully');

        const database = client.db("tourism");
        const placesCollection = database.collection("places");
        const orderCollection = database.collection("orders");


        // get API ----------------------
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const place = await placesCollection.findOne(query);
            console.log('load place with id: ', id);
            res.send(place);
        })

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const order = await orderCollection.findOne(query);
            console.log('load place with id: ', id);
            res.send(order);
        })

        // post API -------------------------
        app.post('/places', async (req, res) => {
            const newplace = req.body;
            const result = await placesCollection.insertOne(newplace);

            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        })

        // post order API -------------------------
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);

            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
        })

        // delete API ------------------------
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await placesCollection.deleteOne(query);
            console.log('deleting user with id : ', result);
            res.json(result);
        });

        // PUT API -------------------------------
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const query = { _id: id };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'Approved'
                },
            };
            const update = await orderCollection.updateOne(query, updateDoc, options);
            res.json(update);
        })
    }

    finally {
        // await client.close();
    }


}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello from the Assignment 11 server');
})

app.listen(port, () => {
    console.log('listening to port ', port);
})