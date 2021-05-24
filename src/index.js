import dotenv from "dotenv"
dotenv.config();

import express from 'express';
import cors from 'cors';
import connect from './db.js'
import data from './Namirnice.js'
import mongo from 'mongodb'
import auth from './auth.js';

 

const app = express()  // instanciranje aplikacije
const port = 3200  // port na kojem će web server slušati

app.use(cors());
app.use(express.json());


app.post('/', (req, res) => {
    console.log("dobio sam post")
    res.json({status: 'ok'})
}),


app.get("/tajna", [auth.verify] ,(req, res) => {

    res.json({message: "Ovo je tajna " + req.jwt.email})
})

app.post("/auth", async (req, res) => {
    let user = req.body

    try {
       let result = await auth.authUser(user.email, user.lozinka )
       res.json(result)
    }
    catch(e) {
        res.status(401).json({error: e.message})

    }
})


app.post("/users", async (req, res) => {

    let user = req.body;

    let id;

    try{
    id = await auth.registerUser(user)
    }
    catch (e){
        res.status(500).json({error: e.message})
    }
    res.json({id: id})
})







//----------POJEDINACNI PLAN-----------//


app.get('/pojedinacniPlan', [auth.verify] ,async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("pojedinacniPlan").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get("/pojedinacniPlan/:id", async (req, res) => {
    let id = req.params.id;
    let db = await connect();

    let doc = await db.collection("pojedinacniPlan").findOne({_id: mongo.ObjectID(id)})
    res.json(doc)

   

    });


app.patch("/pojedinacniPlan/:id", [auth.verify] ,async (req, res) => {
    let id = req.params.id
    let data = req.body

    let db = await connect();

    let result = await db.collection("pojedinacniPlan").updateOne(
        {_id: mongo.ObjectID(id) },
        {
            $set: data,
        }
    )

    if(result && result.modifiedCount == 1) {
        let doc = await db.collection("pojedinacniPlan").findOne({_id:mongo.ObjectID(id)})
        res.json(doc)
    } else {
        res.json({
            status:"fail"
        })
    }
})


//----------SpremiPoTjednu-----------//


app.patch("/SpremiTjedan/:id", [auth.verify] ,async (req, res) => {
    
    
    let id = req.params.id;
    let data = req.body;
    
    

    let db = await connect();

    let result = await db.collection("SpremiTjedan").updateOne(
        { _id: mongo.ObjectId(id) },
        {
           $set: data,
        }
    )

    if(result && result.modifiedCount == 1) {
       let doc = await db.collection("SpremiTjedan").findOne({_id: mongo.ObjectID(id)})
       res.json(doc)

    } else {
        res.json({
            status:"fail"
        })
    }


    });


app.post("/SpremiTjedan",[auth.verify] , async (req, res) => {
    let data = req.body

    let db = await connect();

    let result = await db.collection('SpremiTjedan').insertOne(data);

    if(result && result.insertedCount == 1){
        res.json(result.ops[0]);
    } else {
        res.json({
            status:"fail"
        })
    }
})

app.get('/SpremiTjedan', [auth.verify] ,async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("SpremiTjedan").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get("/SpremiTjedan/:id", async (req, res) => {
    let id = req.params.id;
    let db = await connect();

    let doc = await db.collection("SpremiTjedan").findOne({_id: mongo.ObjectID(id)})
    res.json(doc)

   

    });



//------namirnice po id, mongo---------//


app.get('/meso',[auth.verify]  ,async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("meso").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get('/kruh', async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("kruh").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get('/ribe', async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("ribe").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get('/brza_hrana', async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("brza_hrana").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get('/voce', async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("voce").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get('/povrce', async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("povrce").find()
    let result = await cursor.toArray()

    res.json(result)
})

app.get('/mlijecni_proizvodi', async (req, res) => {
    let db = await connect()

    let cursor = await db.collection("mlijecni_proizvodi").find()
    let result = await cursor.toArray()

    res.json(result)
})




//namirnice po id

app.get('/meso_memory', (req, res) => res.json(data.meso.data));
app.get('/meso_memory/:id', (req, res) =>  {

    let id = req.params.id
    console.log("ID od mesa ", id);

    res.json(data.meso.data.filter((x) => x.id == id))

});

//ostale namirnice
app.get('/kruh_memory', (req, res) => res.json(data.kruh));



app.get('/ribe_memory', (req, res) => res.json(data.ribe));
app.get('/brza_hrana_memory', (req, res) => res.json(data.brza_hrana));
app.get('/voce_memory', (req, res) => res.json(data.voce));
app.get('/povrce_memory', (req, res) => res.json(data.povrce));
app.get('/mlijecni_proizvodi_memory', (req, res) => res.json(data.mlijecni_proizvodi));








app.listen(port, () => console.log(`Slušam na portu ${port}!`))
