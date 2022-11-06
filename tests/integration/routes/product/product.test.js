import fs from 'fs';
import path from 'path';

import request from 'supertest';
import sharp from 'sharp';

import Category from '../../../../src/models/category.js';
import Order from '../../../../src/models/order.js';
import Product from '../../../../src/models/product.js';
import User from '../../../../src/models/user.js';
import { loginUser } from '../../../utils/login.js';

import { rootPath } from '../../../../src/utils/rootPath.js';

const sampleImage = await sharp({
  create: {
    width: 48,
    height: 48,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 0.5 },
  },
})
  .png()
  .toBuffer();

let app;
describe('/products/', () => {
  beforeAll(
    async () => (app = await (await import('../../../../src/app.js')).server)
  );

  afterAll(() => {
    app.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
    const products = await Product.find();
    products.forEach((item) => {
      const imagePath = path.join(rootPath, item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
  });

  const userAndCategoryExec = function () {
    return Promise.all([
      User.create({
        fullname: 'aaa',
        email: 'aaa@gmail.com',
        password: '12345678',
        age: 12,
        isAdmin: true,
      }),
      Category.create({ name: 'test' }),
    ]);
  };

  describe('GET', () => {
    it('should return all products in our db', async () => {
      const userAndCategory = await userAndCategoryExec();
      const insertedProducts = await Product.insertMany([
        {
          title: 'this is sample product',
          description:
            'this is sample product description for test and it should be at least 25 chars.',
          image: 'a.png',
          category: userAndCategory[1]._id,
          price: 199,
          status: 'public',
          user: userAndCategory[0]._id,
        },
        {
          title: 'this is sample product',
          description:
            'this is sample product description for test and it should be at least 25 chars.',
          image: 'a.png',
          category: userAndCategory[1]._id,
          price: 299,
          status: 'private',
          user: userAndCategory[0]._id,
        },
      ]);

      const products = await request(app).get('/products/');
      expect(products.body.data.products.length).toBe(2);
    });

    it('should return an object that contain a product details', async () => {
      const userAndCategory = await userAndCategoryExec();
      const product = {
        title: 'this is sample product',
        description:
          'this is sample product description for test and it should be at least 25 chars.',
        image: 'a.png',
        category: userAndCategory[1]._id,
        price: 199,
        status: 'public',
        user: userAndCategory[0]._id,
      };
      const insertedProduct = await Product.create(product);

      const products = await request(app).get(
        `/products/${insertedProduct._id}`
      );
      expect(products.body.data.product).toMatchObject(product);
    });
  });

  describe('POST', () => {
    let token = '';
    let productSample = {};
    const exec = function () {
      return request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .field('title', productSample.title)
        .field('description', productSample.description)
        .field('status', productSample.status)
        .field('price', productSample.price)
        .field('category[0]', productSample.category.name)
        .attach('image', sampleImage, productSample.image);
    };
    it('should create product and return that', async () => {
      const userAndCategory = await userAndCategoryExec();
      const login = await loginUser(app);
      token = login.body.data.token;
      const product = {
        title: 'this is sample product',
        description:
          'this is sample product description for test and it should be at least 25 chars.',
        image: 'a.png',
        category: userAndCategory[1],
        price: 199,
        status: 'public',
        user: login.body.data.user._id,
      };
      productSample = product;

      const postProduct = await exec();
      expect(postProduct.body.data.product).toMatchObject(
        Object.assign(product, {
          category: [product.category.id],
          image: postProduct.body.data.product.image,
        })
      );
    });
  });
});
