import Category from '../../../src/models/category.js';
import Order from '../../../src/models/order.js';
import Product from '../../../src/models/product.js';
import User from '../../../src/models/user.js';

let app;
describe('User', () => {
  beforeAll(
    async () => (app = await (await import('../../../src/app.js')).server)
  );

  afterAll(() => {
    app.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
  });

  const userObject = {
    fullname: 'aaaa',
    email: 'a@gmail.com',
    age: 24,
    password: '12345678',
    confirmPassword: '12345678',
    isAdmin: true,
  };

  const invalidUserObject = {
    fullname: 'a',
    email: 'a',
    age: 0,
    password: '1234',
    confirmPassword: '123456789',
    isAdmin: true,
  };

  // validation
  describe('Validation', () => {
    // user register validation
    it('should return true if passed object contains validation rules', async () => {
      const validation = await User.userRegisterValidation(userObject);

      expect(validation).toBe(true);
    });

    it('should return an array of objects if validation is failed', async () => {
      const validation = await User.userRegisterValidation(invalidUserObject);

      expect(validation).not.toBe(true);
    });

    // user cart validation
    it('should return true if passed array is containing valid product and quantity', async () => {
      const user = await User.create({
        fullname: 'aaa',
        email: 'aaa@gmail.com',
        password: '12345678',
        age: 12,
        isAdmin: true,
      });
      const category = await Category.create({ name: 'test' });
      const product = await Product.create({
        title: 'this is sample product',
        description:
          'this is sample product description for test and it should be at least 25 chars.',
        image: 'a.png',
        category: [category._id],
        price: 199,
        status: 'public',
        user: user._id,
      });
      user.cart.push({ product: product._id, quantity: 1 });
      await user.save();

      const validation = await User.cartValidation(user.cart[0]);
      expect(validation).toBe(true);
    });

    it('should return an array of objects if passed cart item is invalid', async () => {
      const validation = await User.cartValidation({});
      expect(validation).not.toBe(true);
    });
  });

  describe('Model', () => {
    it('should return user if user created in db', async () => {
      const user = await User.create(userObject);

      const userExists = await User.findOne({ _id: user._id });

      expect(userExists.toObject()).toMatchObject(user.toObject());
    });

    it('should throw if user not created in db or userObject is invalid', async () => {
      await expect(User.create(invalidUserObject)).rejects.toThrow();
    });
  });
});
