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
  });

  const userObject = {
    fullname: 'aaaa',
    email: 'a@gmail.com',
    age: 24,
    password: '12345678',
    confirmPassword: '12345678',
  };

  const invalidUserObject = {
    fullname: 'a',
    email: 'a',
    age: 0,
    password: '1234',
    confirmPassword: '123456789',
  };

  // validation
  describe('Validation', () => {
    it('should return true if passed object contains validation rules', async () => {
      const validation = await User.userRegisterValidation(userObject);

      expect(validation).toBe(true);
    });

    it('should return an array of objects if validation is failed', async () => {
      const validation = await User.userRegisterValidation(invalidUserObject);

      expect(validation).not.toBe(true);
    });
  });

  describe('Model', () => {
    it('should return user if user created in db', async () => {
      const user = await User.create(userObject);

      const userExists = await User.findOne({ _id: user._id });

      expect(userExists.toObject()).toMatchObject(user.toObject());
    });

    it('should throw if user not created in db', async () => {
      await expect(User.create(invalidUserObject)).rejects.toThrow();
    });
  });
});
