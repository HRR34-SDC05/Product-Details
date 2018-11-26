/* eslint-disable no-loop-func */
const fs = require('fs');
const path = require('path');
const faker = require('faker');

const dataFile = path.join(__dirnam, '../../data.csv');

const generator = async (mass, exp, itr) => {
  let iterator = 1;
  let idCount = 1;
  console.time('GeneratorFunc');

  while (iterator <= itr) {
    const again = async () => {
      for (let i = 0; i < exp; i++) {
        const products = JSON.stringify({
          id: idCount,
          name: faker.commerce.productName(),
          rating: Number(faker.finance.amount(1, 5, 1)),
          review_count: faker.random.number({ min: 20, max: 150 }),
          item_num: i,
          price: faker.commerce.price(50, 500),
          main_image: 'http://placekitten.com/700/500',
          images: populateImages(i),
        });
        if (idCount === 500000) {
          await stream.write(`${products}`)
        } else {
          await stream.write(`${products}\n`);
          idCount += 1;
        }
      }
    };
    for (let x = 0; x < mass; x++) {
      await again();
    }
    iterator += 1;
  }
  console.timeEnd('GeneratorFunc');
};

generator(10, 10, 10);
