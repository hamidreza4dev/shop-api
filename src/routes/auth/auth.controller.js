import User from '../../models/user.js';

/**
 * PORT login
 * @route /auth/login
 * @type {import('express').RequestHandler}
 */
export const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('User Not Found !');
      error.statusCode = 422;
      error.data = { actualEmail: email };
      throw error;
    }

    const isMatch = await User.isPasswordsSame(user.password, password);
    if (!isMatch) {
      const error = new Error('Email or password is incorrect !');
      error.statusCode = 422;
      throw error;
    }

    const token = user.generateAuthToken();
    res.status(200).json({
      success: true,
      message: 'successfully logged in !',
      data: {
        token,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST register
 * @route /auth/register
 * @type {import('express').RequestHandler}
 */
export const postRegister = async (req, res, next) => {
  try {
    const validation = await User.userRegisterValidation(req.body);

    if (validation !== true) {
      const error = new Error('Validation Error !');
      error.data = validation;
      error.statusCode = 422;
      throw error;
    }

    const { fullname, email, password, confirmPassword } = req.body;
    const user = await User.create({
      fullname,
      email,
      password,
      confirmPassword,
    });

    if (!user) {
      const error = new Error('Cannot Create User !');
      error.statusCode = 500;
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'User Created !',
      data: {
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
