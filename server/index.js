require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool, Client } = require('pg');
const config = require('../database/postgres/config.json');

const app = express();

const host = config.host;
const user = config.user;
const pw = config.pw;
const db = config.db;
const port = config.port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;

const client = new Client({
  connectionString: conString,
  // database: 'gs_details'
});
client.connect();
// const Products = require('../database/postgres/index.js');
client.query('SELECT * FROM details WHERE id = 68')
 .then((resp) => { console.log(resp.rows[0].images.split(',')); });

const PORT = 8081;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../client/dist`, { maxAge: '365d' }));

app.get('/', (req, res) => {
  console.log('Made it into the very first load');
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('/data', (req, res) => {
  const id = Math.floor(Math.random() * 100000);
  console.log('id in initial GET request --->', id);
  client.query(`SELECT * FROM details WHERE id = ${id}`)
    .then((resp) => {
      resp.rows[0].images = resp.rows[0].images.split(',');
      resp.rows[0].colors = resp.rows[0].colors.split(',');
      resp.rows[0].rating = Number(resp.rows[0].rating);
      resp.rows[0].price = Number(resp.rows[0].price);
      res.send(resp.rows[0]);
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
  res.status(200).send("post request completed");
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
