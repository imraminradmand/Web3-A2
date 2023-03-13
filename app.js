const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

const dbName = "a2";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

const start = async () => {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log("Connected successfully to db");
    const db = client.db(dbName);

    // Set up routes
    const routes = require("./src/routes")(db);
    app.use("/api", routes);

    app.get("/", (req, res) => {
      res.render("pages/index");
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
