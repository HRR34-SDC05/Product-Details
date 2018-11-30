// require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool, Client } = require('pg');
const config = require('../database/postgres/config.json');

const app = express();

const environ = 'development';

const host = config[environ].host;
const user = config[environ].user;
const pw = config[environ].pw;
const db = config[environ].db;
const port = config[environ].port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;

const client = new Client({
  connectionString: conString,
});
client.connect();

const PORT = 3030;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../client/dist`, { maxAge: '365d' }));

app.get('/product/:id', (req, res) => {
  console.log('Made it into the very first load');
  const file = path.join(`${__dirname}/../client/dist/index.html`);
  res.sendFile(file);
});

app.get('/product/data/:id', (req, res) => {
  const id = req.params.id || Math.floor(Math.random() * 100000);
  console.log('id in initial GET request --->', id);
  client.query(`SELECT * FROM details WHERE id = ${id}`)
    .then((resp) => {
      resp.rows[0].images = resp.rows[0].images.split(',');
      resp.rows[0].colors = resp.rows[0].colors.split(',');
      resp.rows[0].rating = Number(resp.rows[0].rating);
      resp.rows[0].price = Number(resp.rows[0].price);
      res.status(200).send(resp.rows[0]);
    })
    .catch(() => res.status(500).send('Could not receive GET request'));
  // Products.findById(id).exec((err, result) => {
  //   if (err) {
  //     res.status(500).send("Could not receive GET request");
  //   } else {
  //     res.send(result);
  //   }
  // });
});

// below are additional methods added for sake of stress testing

app.post("/product/:id", (req, res) => {
  res.status(201).send("post request completed");
});

app.delete("/product/:id", (req, res) => {
  res.status(200).send("delete request completed");
});

app.put("/product/:id", (req, res) => {
  res.status(200).send("put request completed");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
