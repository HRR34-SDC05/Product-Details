const { Pool, Client } = require('pg');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const copyFrom = require('pg-copy-streams').from;
const config = require('./config.json');

const dataFile = path.join(__dirname, '../../data-post.csv');
const table = 'details';

const host = config.host;
const user = config.user;
const pw = config.pw;
const db = config.db;
const port = config.port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;
const createQuery = `
  CREATE TABLE details (id SERIAL, colorS TEXT, images TEXT, item_num INT, main_image VARCHAR(255), name VARCHAR(255), price DECIMAL, rating DECIMAL, review_count INT, PRIMARY KEY(id));`
// const alphabetical = `CREATE TABLE details (id SERIAL, colorS TEXT, images TEXT, item_num INT, main_image VARCHAR(255), name VARCHAR(255), price DECIMAL, rating DECIMAL, review_count INT, PRIMARY KEY(id));`
const insertText = `
  INSERT INTO details (name, rating, review_count, item_num, price, main_image, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

const client = new Client({
  connectionString: conString,
  // database: 'gs_details'
});
client.connect();

const executeQuery = (targetTable) => {
  console.time('Seeding')
  client.query('DROP TABLE IF EXISTS details');
  client.query(createQuery);
  const execute = (target, callback) => {
    client.query(`Truncate ${target}`, (err) => {
      if (err) {
        client.end();
        callback(err);
      } else {
        console.log(`Truncated ${target}`);
        callback(null, target);
      }
    });
  };
  execute(targetTable, (err) => {
    if (err) return console.log(`Error in Truncate: ${err}`);
    const stream = client.query(copyFrom(`COPY ${table} FROM STDIN (FORMAT CSV)`));
    const fileStream = fs.createReadStream(dataFile);
    fileStream.on('error', (error) => {
      console.log(`Error in read stream: ${error}`);
    });
    stream.on('error', (error) => {
      console.log(`Error in creating stream: ${error}`);
    });
    stream.on('end', () => {
      console.log('Completed copy command.');
      client.end();
    });
    fileStream.pipe(stream);
  });
  console.timeEnd('Seeding');
};

executeQuery(table);

module.exports = client;

// const createQuery = `
//     CREATE TABLE details (id SERIAL, name VARCHAR(255), rating DECIMAL, review_count INT, item_num INT, price DECIMAL, main_image VARCHAR(255), images JSONB, PRIMARY KEY (id));`;

// const insertText = `
//     INSERT INTO details (name, rating, review_count, item_num, price, main_image, images) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

// const copyQuery = `
//     COPY details(id,name,rating,reviewCount,itemNum,price,mainImage,images) FROM ${dataFile} WITH (FORMAT csv)';
// `

// const initTable = (data) => {
//   const tablePromise = new Promise((res) => {
//     db.connect((err, client) => {
//     //   console.log('client in promise', client)
//       client.query('BEGIN').then(() => {
//         console.log('just before drop table');
//         client
//           .query('DROP TABLE IF EXISTS details')
//           .then(() => {
//             console.log('Pre createQuery')
//             client.query(createQuery);
//           })
//           .then(() => {
//               console.log('--Pre copyQuery--')
//               client.query(copyQuery)
//             })
//           .then(() => client.query('COMMIT'))
//           .then(() => client.end())
//           .catch(() => {
//               console.log('you no make it')
//               client.end();
//             })
//       });
//     });
//   });
//   return tablePromise;
// };

// initTable();

// module.exports = initTable;

// const readText = (file) => {
//     return new Promise((resolve, reject) => {
//       const src = fs.createReadStream(path.join(__dirname,'../data.txt'))
//       let doc = '';
//       src.on('data', (chunk) => {doc += chunk});
//   src.on('end', () => {
//       let recArray = doc.split('\n');
//       recArray = recArray.map(elem => {return JSON.parse(elem)});
//       resolve(recArray);
//   })
//     })
// }


// const readFromTxt = function (fileId) {
//   return new Promise((resolve , reject) => {
//     // console.time('ReadFiles')
//     // for (let i = fileStart; i < fileEnd; i++) {
//     // console.log(`Currently reading the file --> ${fileId}`);
//     const src = fs.createReadStream(path.join(__dirname,`sampleData/sampleData_${fileId}.txt`))
//     let doc ='';
//     src.on('data', (chunk) => {doc += chunk})
//     src.on('end', () => {
//       let recordsArray = doc.split('\n')//
//       // console.log(`The length of the recordsArray is ${recordsArray.length}`);
//       recordsArray.pop(); // eliminates the newline on the very last reccord
//       recordsArray = recordsArray.map((rec) => {return JSON.parse(rec)});
//       resolve(recordsArray)
//       // Description.create(recordsArray, (err) => {
//       //   if (err) {console.log(`There's an error on insert --> `, err)}
//       // })
//     })
//     // console.timeEnd('ReadFiles')
//   })

// }
