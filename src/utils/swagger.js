import productsDoc from '../routes/product/product.docs.js';

/** @type {import('swagger-ui-express').SwaggerOptions} */
const swaggerOptions = {
  openapi: '3.0.0',
  info: {
    title: 'shop API',
    version: '1.0.0',
    description: 'Shop API with mongoose and express',
  },
  servers: [
    {
      url: 'http://localhost:8000/',
      description: 'development',
    },
  ],
  tags: [
    {
      name: 'products',
    },
  ],
  paths: {
    ...productsDoc,
  },
};

export default swaggerOptions;
