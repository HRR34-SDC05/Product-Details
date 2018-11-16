const { Pool, Client } = require('pg');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const copyFrom = require('pg-copy-streams').from;
const config = require('./config.json')

const dataFile = path.join(__dirname, '../../data.csv');
const table = 'details';

const host = config.host;
const user = config.user;
const pw = config.pw;
const db = config.db;
const port = config.port;
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`;
const createQuery = `
    CREATE TABLE details (id SERIAL, name VARCHAR(255), rating DECIMAL, review_count INT, item_num INT, price DECIMAL, main_image VARCHAR(255), images TEXT, colors TEXT, PRIMARY KEY (id));`;
const insertText = `
    INSERT INTO details (name, rating, review_count, item_num, price, main_image, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

const client = new Client({
  connectionString: conString,
  // database: 'gs_details'
});
client.connect();

const executeQuery = (targetTable) => {
    client.query('DROP TABLE IF EXISTS details')
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
        if(err) return console.log(`Error in Truncate: ${err}`);
        let stream = client.query(copyFrom(`COPY ${table} FROM STDIN (FORMAT CSV)`));
        var fileStream = fs.createReadStream(dataFile);
    //     let doc = '';
    //     fileStream.on('data', (chunk) => doc += chunk)
    //     fileStream.on('end', () => {
    //       let recArray = doc.split('\n');
    //       recArray = recArray.map(elem => {return JSON.parse(elem)});
    //       console.log('recArray[0] -->', recArray[0]);
    //     //   fileStream.pipe(stream);
    //   })
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
};

executeQuery(table);


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