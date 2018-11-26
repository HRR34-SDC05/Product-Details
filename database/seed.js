/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const faker = require('faker');
const csv = require('fast-csv');
// const stream = fs.createWriteStream('./data.csv');

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

const randomNum = () => Math.floor(Math.random() * Math.floor(100));
let numOfImages;

const populateImages = (index) => {
  const images = ['http://placekitten.com/700/500'];

  for (let i = 4; i > 0; i -= 1) {
    if (index % i === 0) {
      numOfImages = i - 1;
      break;
    }
  }
  for (let i = 1; i <= numOfImages; i++) {
    images.push('http://placekitten.com/700/500');
  }
  return images;
};
const populateColors = (index) => {
  const colors = [capitalizeFirst(faker.commerce.color())];

  for (let i = 4; i > 0; i -= 1) {
    if (index % i === 0) {
      numOfImages = i - 1;
      break;
    }
  }
  for (let i = 1; i <= numOfImages; i++) {
    colors.push(capitalizeFirst(faker.commerce.color()));
  }
  return colors;
};

let idCount = 0;

const seedMe = () => {
  // let id = idCount;
  idCount++;

  return {
    id: idCount,
    colors: populateColors(idCount),
    images: populateImages(idCount),
    item_num: idCount,
    main_image: 'http://placekitten.com/700/500',
    name: faker.commerce.productName(),
    price: faker.commerce.price(50, 500),
    rating: Number(faker.finance.amount(1, 5, 1)),
    review_count: faker.random.number({ min: 20, max: 150 }),
  };
};

const genCSV = async () => {
  console.time('GenerateCSV');
  const csvStream = csv.createWriteStream({ headers: false, objectMode: true });
  const writableStream = fs.createWriteStream('data-post.csv');
  writableStream.on('finish', () => {
    console.log('Generated CSV file');
  });
  csvStream.pipe(writableStream);
  for (let i = 0; i < 10000000; i++) {
    csvStream.write(seedMe());
  }
  csvStream.end();
  console.timeEnd('GenerateCSV');
};

genCSV();

// const generator = async (mass, exp, itr) => {
//   let iterator = 1;
//   let idCount = 1;
//   console.time('GeneratorFunc');

//   while (iterator <= itr) {
//     const again = async () => {
//       for (let i = 0; i < exp; i++) {
//         let products = JSON.stringify({
//           id: idCount,
//           name: faker.commerce.productName(),
//           rating: Number(faker.finance.amount(1, 5, 1)),
//           review_count: faker.random.number({ min: 20, max: 150 }),
//           item_num: i,
//           price: faker.commerce.price(50, 500),
//           main_image: `http://placekitten.com/700/500`,
//           images: populateImages(i),
//         });
//         if(idCount === 500000){
//           await stream.write(`${products}`)
//         } else {
//           await stream.write(`${products}\n`);
//           idCount += 1;
//         }
//       }
//     };
//     for (let x = 0; x < mass; x++) {
//       await again();
//     }
//     iterator += 1;
//   }
//   console.timeEnd('GeneratorFunc');
// };

// generator(50, 100, 100);
