import request from 'supertest';

export const loginUser = async function (app) {
  const userObject = {
    fullname: 'hamidreza',
    email: 'hamidreza4dev@gmail.com',
    password: '12345678',
    confirmPassword: '12345678',
  };
  const registerResult = await request(app)
    .post('/auth/register')
    .send(userObject);

  return request(app).post('/auth/login').send({
    email: userObject.email,
    password: userObject.password,
  });
};
