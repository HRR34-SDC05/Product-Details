/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const faker = require('faker');

const stream = fs.createWriteStream('data.csv');
const csv = require('fast-csv');

const headers = [
  'id',
  'name',
  'rating',
  'reviewCount',
  'itemNum',
  'price',
  'mainImage',
  'images',
];

const csvStream = csv.createWriteStream({ headers });

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

const populateImages = (index) => {
  const images = [
    {
      image: `https://s3-us-west-1.amazonaws.com/hrr34-trailblazer/${index}-min.jpg`,
      color: capitalizeFirst(faker.commerce.color()),
    },
  ];
  let numOfImages;

  for (let i = 4; i > 0; i -= 1) {
    if (index % i === 0) {
      numOfImages = i - 1;
      break;
    }
  }
  for (let i = 1; i <= numOfImages; i++) {
    images.push({
      image: `https://s3-us-west-1.amazonaws.com/hrr34-trailblazer/${randomNum()}-min.jpg`,
      color: capitalizeFirst(faker.commerce.color()),
    });
  }
  return images;
};

const generator = async();

const createMockProducts = () => {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    products.push({
      id: i,
      name: faker.commerce.productName(),
      rating: Number(faker.finance.amount(1, 5, 1)),
      reviewCount: faker.random.number({ min: 20, max: 150 }),
      itemNum: i,
      price: faker.commerce.price(50, 500),
      mainImage: `https://s3-us-west-1.amazonaws.com/hrr34-trailblazer/${i}-min.jpg`,
      images: populateImages(i),
    });
  }
  return products;
};

const data = createMockProducts();

module.exports.createMockProducts = createMockProducts;
