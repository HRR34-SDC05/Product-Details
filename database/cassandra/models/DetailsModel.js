const ExpressCassandra = require('express-cassandra');
const faker = require('faker');
const cassandra = require('cassandra-driver');
// const client = new cassandra.Client({ keyspace: 'gs_details' });

const models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'gs_details',
    queryOptions: { consistency: ExpressCassandra.consistencies.one },
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1,
    },
    migration: 'safe',
  },
});

// console.log(models)

const schema = models.loadSchema('details', {
  fields: {
    id: 'int',
    colors: {
      type: 'list',
      typeDef: '<text>',
    },
    images: {
      type: 'list',
      typeDef: '<text>',
    },
    item_num: 'int',
    main_image: 'text',
    name: 'text',
    price: 'float',
    rating: 'float',
    review_count: 'int',
  },
  key: ['id'],
});

console.log(models.instance.details === schema);
console.log('MyModel', schema);

schema.syncDB((err, result) => {
  if (err) {
    console.log('error in synchDb', err);
  } else {
    console.log('Success', result);
  }
});
console.log(models.instance.details.execute_query);
const copyQuery = `copy details from '/Users/user/Desktop/hr-remote/Product-Details/data-cass.csv' WITH DELIMITER=',' AND HEADER=true;`;

// above query has to be run in command line for some reason. Still trying to work that out.

models.instance.details.execute_query(copyQuery, null, (err) => {
  if (err) {
    console.log('Made it into execute query');
    console.log(copyQuery);
  }
});




// const capitalizeFirst = (str) => {
//   let capitalized = str[0].toUpperCase();
//   for (let i = 1; i < str.length; i++) {
//     if (str[i - 1] === ' ') {
//       capitalized += str[i].toUpperCase();
//     } else {
//       capitalized += str[i];
//     }
//   }
//   return capitalized;
// };

// const randomNum = () => Math.floor(Math.random() * Math.floor(100));
// let numOfImages;

// const populateImages = (index) => {
//   const images = ['http://placekitten.com/700/500'];

//   for (let i = 4; i > 0; i -= 1) {
//     if (index % i === 0) {
//       numOfImages = i - 1;
//       break;
//     }
//   }
//   for (let i = 1; i <= numOfImages; i++) {
//     images.push('http://placekitten.com/700/500');
//   }
//   return images;
// };
// const populateColors = (index) => {
//   const colors = [capitalizeFirst(faker.commerce.color())];

//   for (let i = 4; i > 0; i -= 1) {
//     if (index % i === 0) {
//       numOfImages = i - 1;
//       break;
//     }
//   }
//   for (let i = 1; i <= numOfImages; i++) {
//     colors.push(capitalizeFirst(faker.commerce.color()));
//   }
//   return colors;
// };

// const generator = async (mass, exp, itr) => {
//   let iterator = 1;
//   let idCount = 0;

//   console.time('GeneratorFunc');

//   while (iterator <= itr) {
//     const again = async () => {
//       var i = 0;
//       for (let i = 0; i < exp; i++) {
//         const products = new models.instance.details({
//           id: idCount,
//           name: faker.commerce.productName(),
//           rating: Number(faker.finance.amount(1, 5, 1)),
//           review_count: Number(faker.random.number({ min: 20, max: 150 })),
//           item_num: i,
//           price: Number(faker.commerce.price(50, 500)),
//           main_image: 'http://placekitten.com/700/500',
//           images: populateImages(i),
//           colors: populateColors(i),
//         });
//         products.save((err) => {
//           if (err) {
//             console.log('err on 114', err);
//           } else {
//             console.log('Saved test item + idCount', idCount);
//           }
//           idCount++;
//         });
//       }
//     };
//     for (let x = 0; x < mass; x++) {
//       await again();
//     }
//     iterator += 1;
//   }
//   console.timeEnd('GeneratorFunc');
// };

// generator(10, 5, 5);

// const product = new models.instance.details({
//   id: 1,
//   name: 'backpack',
//   rating: 4.02,
//   review_count: 32,
//   item_num: 4,
//   price: 37.48,
//   main_image: 'http://placekitten/700/550',
//   images: ['http://placekitten/700/550'],
//   colors: ['Teal'],
// });
// product.save((err) => {
//   if (err) {
//     console.log('err');
//   } else {
//     console.log('Saved test item');
//   }
// });