const get = {
  tags: ['products'],
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              success: true,
              message: 'Products Fetched !',
              data: {
                products: [
                  {
                    _id: '<id>',
                    title: '<title>',
                    description: '<description>',
                    image: '<imagePath>',
                    category: ['<categoryId>'],
                    price: 0,
                    status: '<public><private><sold-out>',
                    user: '<id>',
                    createdAt: '<ISODate>',
                    updatedAt: '<ISODate>',
                  },
                ],
                total: 0,
              },
            },
          },
        },
      },
    },
  },
};

const productsDoc = {
  '/products/': {
    get,
  },
};

export default productsDoc;
