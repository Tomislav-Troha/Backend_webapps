import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connect from "./db.js";
import data from "./Namirnice.js";
import mongo from "mongodb";
import auth from "./auth.js";

const app = express(); // instanciranje aplikacije
//const port = process.env.PORT || 3000; // port na kojem će web server slušati

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3100;

app.listen(port, function () {
  console.log("Server se slusa na portu", port);
});

//--------------------//

app.use("/api/private", auth.permit("admin"));

app.post("/", (req, res) => {
  console.log("dobio sam post");
  res.json({ status: "ok" });
}),
  app.get("/tajna", [auth.verify], (req, res) => {
    res.json({ message: "Ovo je tajna " + req.jwt.email });
  });

//uzmi sve podatke za admina

app.get("/admin", [auth.verify], auth.permit("admin"), async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("users").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get(
  "/admin/:email",
  [auth.verify],
  auth.permit("admin"),
  async (req, res) => {
    let db = await connect();

    let doc = await db.collection("users").findOne({ role: "admin" });
    //console.log(doc);

    res.json(doc);
  }
);

//brisi podatke, samo admin

app.post(
  "/admin/:email",
  [auth.verify],
  auth.permit("admin"),
  async (req, res) => {
    let email = req.body.email;

    let db = await connect();
    //console.log(email);
    let result = await db.collection("users").deleteOne({ email: email });

    let pojedinacni = await db
      .collection("pojedinacniPlan")
      .deleteOne({ email: email });

    let obiteljski = await db
      .collection("SpremiTjedan")
      .deleteOne({ email: email });
    //console.log(result);

    if (
      (obiteljski && obiteljski.deletedCount == 1) ||
      (pojedinacni && pojedinacni.deletedCount == 1) ||
      (result && result.deletedCount == 1)
    ) {
      res.json({ status: "Izbrisano" });
    } else {
      res.json({
        status: "fail",
      });
    }
  }
);

//promjena lozinke

app.patch("/users", [auth.verify], async (req, res) => {
  let changes = req.body;

  let email = req.jwt.email;

  if (changes.new_password && changes.old_password) {
    let result = await auth.promjenaLozinke(
      email,
      changes.old_password,
      changes.new_password
    );
    //console.log(changes.old_password);
    if (result) {
      res.status(201).send();
    } else {
      res.status(500).json({ error: "promjena lozinke neuspjesna" });
    }
  } else {
    res.status(400).json({ error: "krivi upit" });
  }
});

//autorizacija
app.post("/auth", async (req, res) => {
  let user = req.body;

  try {
    let result = await auth.authUser(user.email, user.lozinka);
    res.json(result);
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
});

app.post("/users", async (req, res) => {
  let user = req.body;
  let id;

  try {
    id = await auth.registerUser(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  return res.json({ id: id });
});

app.get("/users/:email", async (req, res) => {
  let email = req.params.email;
  let db = await connect();

  let doc = await db.collection("users").findOne({ email: email });

  res.json(doc);
});

app.patch(
  "/users/:email",
  [auth.verify],

  async (req, res) => {
    let email = req.params.email;
    let data = req.body;

    let db = await connect();

    let result = await db.collection("users").updateOne(
      { email: email },
      {
        $set: data,
      }
    );
    //console.log(data, email)
    if (result && result.modifiedCount == 1) {
      let doc = await db.collection("users").findOne({ email: email });
      res.json(doc);
    } else {
      res.json({
        status: "fail",
      });
    }
  }
);

//TRAZI

app.get(
  "/admin/search/one",
  [auth.verify],
  auth.permit("admin"),
  async (req, res) => {
    let db = await connect();
    let query = req.query;

    let selekcija = {};

    if (query.name) {
      selekcija.name = new RegExp(query.name);
    }

    if (query.name2) {
      let pretraga = query.name2;
      let terms = pretraga.split(" ");

      selekcija = {
        $and: [],
      };

      terms.forEach((term) => {
        //console.log("unutar petelje", term);
        let or = {
          $or: [{ email: new RegExp(term) }],
        };

        selekcija.$and.push(or);
      });
    }

    let cursor = await db.collection("users").find(selekcija);
    let results = await cursor.toArray();

    res.json(results);
  }
);

app.get("/pojedinacniPlan/:email", [auth.verify], async (req, res) => {
  let email = req.params.email;
  let db = await connect();

  let doc = await db.collection("pojedinacniPlan").findOne({ email: email });
  res.json(doc);
});

app.patch("/pojedinacniPlan/:email", [auth.verify], async (req, res) => {
  let email = req.params.email;
  let data = req.body;

  let db = await connect();

  let result = await db.collection("pojedinacniPlan").updateOne(
    { email: email },
    {
      $set: data,
    }
  );
  //console.log(data, email)
  if (result && result.modifiedCount == 1) {
    let doc = await db.collection("pojedinacniPlan").findOne({ email: email });
    res.json(doc);
  } else {
    res.json({
      status: "fail",
    });
  }
});

//----------SpremiPoTjednu-----------//

app.patch("/SpremiTjedan/:email", [auth.verify], async (req, res) => {
  let email = req.params.email;
  let data = req.body;

  let db = await connect();

  let result = await db.collection("SpremiTjedan").updateOne(
    { email: email },
    {
      $set: data,
    }
  );
  //console.log(data)
  if (result && result.modifiedCount == 1) {
    let doc = await db.collection("SpremiTjedan").findOne({ email: email });
    res.json(doc);
  } else {
    res.json({
      status: "fail",
    });
  }
});

app.post("/SpremiTjedan", [auth.verify], async (req, res) => {
  let data = req.body;

  let db = await connect();

  let result = await db.collection("SpremiTjedan").insertOne(data);

  if (result && result.insertedCount == 1) {
    res.json(result.ops[0]);
  } else {
    res.json({
      status: "fail",
    });
  }
});

app.get("/SpremiTjedan", [auth.verify], async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("SpremiTjedan").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get("/SpremiTjedan/:email", [auth.verify], async (req, res) => {
  let email = req.params.email;
  let db = await connect();

  let doc = await db.collection("SpremiTjedan").findOne({ email: email });
  res.json(doc);
});

//UserProfile

app.get("/UserProfile/:email", [auth.verify], async (req, res) => {
  let email = req.params.email;
  let db = await connect();
  console.log("ovo je email", email);
  let doc = await db.collection("UserProfile").findOne({ email: email });

  console.log(doc);
  res.json(doc);
});

app.post("/UserProfile/:email", [auth.verify], async (req, res) => {
  let email = req.params.email;
  let data = req.body;

  let db = await connect();

  let result = await db.collection("UserProfile").insert(
    {
      email: email,
      imeRoditelja: data.imeRoditelja,
      imeDjece: data.imeDjece,
    },
    {
      $set: data,
    }
  );
  //console.log(nadimak);
  if (result && result.modifiedCount == 1) {
    let doc = await db.collection("UserProfile").findOne({ email: email });
    res.json(doc);
  } else {
    res.json({
      status: "fail",
    });
  }
});

//------namirnice po id, mongo---------//

app.get("/meso", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("meso").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get("/kruh", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("kruh").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get("/ribe", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("ribe").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get("/brza_hrana", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("brza_hrana").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get("/voce", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("voce").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get("/povrce", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("povrce").find();
  let result = await cursor.toArray();

  res.json(result);
});

app.get("/mlijecni_proizvodi", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("mlijecni_proizvodi").find();
  let result = await cursor.toArray();

  res.json(result);
});

//namirnice po id

app.get("/meso_memory", (req, res) => res.json(data.meso.data));
app.get("/meso_memory/:id", (req, res) => {
  let id = req.params.id;
  console.log("ID od mesa ", id);

  res.json(data.meso.data.filter((x) => x.id == id));
});

//ostale namirnice
app.get("/kruh_memory", (req, res) => res.json(data.kruh));

app.get("/ribe_memory", (req, res) => res.json(data.ribe));
app.get("/brza_hrana_memory", (req, res) => res.json(data.brza_hrana));
app.get("/voce_memory", (req, res) => res.json(data.voce));
app.get("/povrce_memory", (req, res) => res.json(data.povrce));
app.get("/mlijecni_proizvodi_memory", (req, res) =>
  res.json(data.mlijecni_proizvodi)
);
