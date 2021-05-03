import express from 'express';
import cors from 'cors';

import data from './Namirnice.js'
import data_plan from './Prehrambeni_plan.js'
import data_pojedinacno from './Pojedinacni_plan.js';

 

const app = express()  // instanciranje aplikacije
const port = 3200  // port na kojem će web server slušati

app.use(cors());
app.use(express.json());


app.post('/', (req, res) => {
    console.log("dobio sam post")
    res.json({status: 'ok'})
}),


//namirnice po id

app.get('/meso', (req, res) => res.json(data.meso.data));
app.get('/meso/:id', (req, res) =>  {

    let id = req.params.id
    console.log("ID od mesa ", id);

    res.json(data.meso.data.filter((x) => x.id == id))

});

//ostale namirnice
app.get('/kruh', (req, res) => res.json(data.kruh));



app.get('/ribe', (req, res) => res.json(data.ribe));
app.get('/brza_hrana', (req, res) => res.json(data.brza_hrana));
app.get('/voce', (req, res) => res.json(data.voce));
app.get('/povrce', (req, res) => res.json(data.povrce));
app.get('/mlijecni_proizvodi', (req, res) => res.json(data.mlijecni_proizvodi));


//prehrambeni plan za obitelj

app.get('/ponedjeljak', (req, res) => res.json(data_plan.ponedjeljak.data));
app.get('/utorak', (req, res) => res.json(data_plan.utorak.data));
app.get('/srijeda', (req, res) => res.json(data_plan.srijeda.data));
app.get('/cetvrtak', (req, res) => res.json(data_plan.cetvrtak.data));
app.get('/petak', (req, res) => res.json(data_plan.petak.data));

app.get('/subota', (req, res) => res.json(data_plan.subota.data));
app.get('/nedljelja', (req, res) => res.json(data_plan.nedjelja.data));


//pojedinacni plan

//zene, mrsavljenje
app.get('/zene/mrsavljenje', (req, res) => res.json(data_pojedinacno.zene_mrsavljenje));

//zene, fitness
app.get('/zene/fitnes', (req, res) => res.json(data_pojedinacno.zene_fitnes));

//zene, trudnice
app.get('/zene/trudnice', (req, res) => res.json(data_pojedinacno.zene_trudnice));


//muski, mrsavljenje
app.get('/muski/mrsavljenje', (req, res) => res.json(data_pojedinacno.muski_mrsavljenje));


//muski, teretana
app.get('/muski/teretana', (req, res) => res.json(data_pojedinacno.muski_teretana));






app.listen(port, () => console.log(`Slušam na portu ${port}!`))
