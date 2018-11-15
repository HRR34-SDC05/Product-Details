const { Pool } = require('pg');
const faker = require('faker');
const fs = require('fs');
const path = require('path');

const dataFile = fs.createWriteStream(path.join(__dirname, '/data.csv'));

const stringifier = stringify({
  delimiter: ',',
});
const db = new Pool({ database: 'gs_details' });

const createQuery = `
    CREATE TABLE details (id SERIAL, name VARCHAR(255), rating DECIMAL, review_count INT, item_num INT, price DECIMAL, main_image VARCHAR(255), images JSONB, PRIMARY KEY (id));`;

const insertText = `
    INSERT INTO details (name, rating, review_count, item_num, price, main_image, images) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

const capitalizeFirst = (str) => {
  let capitalized = str[0].toUpperCase();
  for (let i = 1; i < str.length; i++) {
    if (str[i - 1] === ' ') {
      capitalized += str[i].toUpperCase();
    } else {
      capitalized += str[i];
    }
  }
  return capitalized;
};

const populateImages = (index) => {
  const imageObj = {
    images: [
      {
        image: 'http://placekitten.com/700/550',
        color: capitalizeFirst(faker.commerce.color()),
      },
    ],
  };
  let numImages;

  for (let i = 4; i > 0; i -= 1) {
    if (index % i === 0) {
      numImages = i - 1;
      break;
    }
  }
  for (let i = 1; i <= numImages; i++) {
    imageObj.images.push({
      image: 'http://placekitten/700/550',
      color: capitalizeFirst(faker.commerce.color()),
    });
  }
  //   console.log('imageObj', imageObj);
  return imageObj;
};

const createMockProducts = (client, res) => {
  // for (let i = 1; i <= 5; i++) {
  let i = 5;
  while (i >= 0) {
    console.log(i);
    const output = [];
    const insertVals = {
      name: faker.commerce.productName(),
      rating: Number(faker.finance.amount(1, 5, 1)),
      review_count: faker.random.number({ min: 20, max: 150 }),
      item_num: i,
      price: faker.commerce.price(50, 500),
      main_image: 'http://placekitten.com/700/500',
      images: populateImages(i),
    };
    stringify(insertVals, (err, out) => {
      console.log(out);
    });
    // .pipe(process.stdout)
    i--;
    // console.log(insertVals)
    // client.query(insertText, insertVals.values, () => {
    //     if(i === 1000) {
    //         client.query('COMMIT', () => {
    //             client.end();
    //             res(true);
    //         });
    //     }
    // });
    // }
  }
};

createMockProducts(null, null);

const initTable = () => {
  const tablePromise = new Promise((res) => {
    db.connect((err, client) => {
      // console.log('client in promise', client)
      client.query('BEGIN').then(() => {
        client
          .query('DROP TABLE details')
          .then(() => {
            client.query(createQuery);
          })
          .then(() => createMockProducts(client, res));
      });
    });
  });
  return tablePromise;
};

// initTable();

module.exports = initTable;
