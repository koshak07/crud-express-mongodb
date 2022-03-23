const express = require("express");
const req = require("express/lib/request");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/");

app.use(express.static(__dirname + "/public"));
(async () => {
  try {
    await mongoClient.connect();
    app.locals.collection = mongoClient.db("usersdb").collection("users");
    await app.listen(3000);
    console.log("Server waits connection");
  } catch (err) {
    return console.log(err);
  }
})();

app.get("/api/users", async (req, res) => {
  const collection = req.app.locals.collection;
  try {
    const users = await collection.find({}).toArray();
    res.send(users);
  } catch (e) {
    return console.log(e);
  }
});

app.get("/api/users/:id", async (req, res) => {
  const id = new objectId(req.params.id);
  const collection = req.app.locals.collection;
  try {
    const user = await collection.findOne({ _id: id });
    res.send(user);
  } catch (err) {
    return console.log(err);
  }
});
app.post("/api/users", jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const userName = req.body.name;
  const userAge = req.body.age;
  let user = { name: userName, age: userAge };
  const collection = req.app.locals.collection;
  try {
    await collection.insertOne(user);
  } catch (err) {
    return console.log(err);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const id = new objectId(req.params.id);
  const collection = req.app.locals.collection;
  try {
    const result = await collection.findOneAndDelete({ _id: id });
    const user = result.value;
    res.send(user);
  } catch (err) {
    return console.log(err);
  }
});

app.put("/api/users", jsonParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const id = new objectId(req.body.id);
  const userName = req.body.name;
  const age = req.body.age;
  const collection = req.app.locals.collection;
  try {
    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: { age: userAge, name: userName } }
    );
  } catch (err) {
    return console.log(err);
  }
});
process.on("SIGINT", async (req, res) => {
  await mongoClient.close();
  console.log("Приложение завершило работу");
  process.exit();
});
