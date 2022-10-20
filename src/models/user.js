import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import userRegisterSchemaCheck from './secure/userSchema.js';
import cartSchemaCheck from './secure/cartSchema.js';

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 36,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
    },
    age: {
      type: Number,
      get: (v) => Math.round(v),
      set: (v) => Math.round(v),
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    cart: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.statics.userRegisterValidation = function (body) {
  return userRegisterSchemaCheck(body);
};

userSchema.statics.cartValidation = function (body) {
  return cartSchemaCheck(body);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      user: {
        _id: this._id,
        fullname: this.fullname,
        email: this.email,
        isAdmin: this.isAdmin,
      },
    },
    process.env.JWT_SECRET
    // TODO: add expire option to jwt
    // {expiresIn: '1d'}
  );
};

userSchema.pre('save', function (next) {
  let user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.statics.isPasswordsSame = function (hash, password) {
  return bcrypt.compare(password, hash);
};

const User = mongoose.model('User', userSchema);

export default User;
