const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nqpxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTracker").collection("notes");
        console.log('db connected');

        // get api to read all notes data
        // api: http://localhost:5000/notes
        app.get('/notes', async (req, res) => {
            const query = req.query;
            // const query = {};
            const cursor = notesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // single data by id {Single data api}
        app.get('/note/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await notesCollection.findOne(query);
            res.send(result);
        });

        // create notes
        // post api: http://localhost:5000/note
        app.post('/note', async (req, res) => {
            const data = req.body;
            const result = await notesCollection.insertOne(data);
            res.send(result);
        });

        //update api notesTracker
        //post api: http://localhost:5000/note/id
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData,
                },
            };
            const result = await notesCollection.updateOne(query, updateDoc, options);
            res.send(result);
        });

        // Delete api
        // api : http://localhost:5000/note/id
        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await notesCollection.deleteOne(query);
            res.send(result);
        })



    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Notes Tracker is Running');
})

app.listen(port, () => {
    console.log('Port is Linstening:', port);
})
