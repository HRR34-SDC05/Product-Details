const ExpressCassandra = require('express-cassandra');

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
    udts: {
      imageobj: {
        image: 'text',
        color: 'text',
      },
    },
  },
});

// console.log(models)

const MyModel = models.loadSchema('details', {
  fields: {
    id: 'int',
    name: 'text',
    rating: 'float',
    reviewCount: 'int',
    itemNum: 'int',
    price: 'float',
    mainImage: 'text',
    images: ({
      type: 'list',
      typeDef: '<frozen<imageobj>>',
    }),
  },
  key: ['id'],
});

console.log(models.instance.details === MyModel);

MyModel.syncDB((err, result) => {
  if (err) throw err;
});

const product = new models.instance.details({
  id: 1,
  name: 'backpack',
  rating: 4.02,
  reviewCount: 32,
  itemNum: 4,
  price: 37.48,
  mainImage: 'http://placekitten/700/550',
  images: [{ image: 'http://placekitten/700/550', color: 'Teal' }],
});
product.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Saved test item');
  }
});
