import { jest } from '@jest/globals';

import jwt from 'jsonwebtoken';

import User from '../../../src/models/user.js';

describe('User', () => {
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

  // test generating auth token
  it('should return auth token and validate when calling user.generateAuthToken', () => {
    const user = new User(userObject);
    const token = user.generateAuthToken();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    expect(decodedToken.user).toMatchObject({
      fullname: userObject.fullname,
      email: userObject.email,
    });
  });
});
