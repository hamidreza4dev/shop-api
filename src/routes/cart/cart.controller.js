import User from '../../models/user.js';

/**
 * GET cart
 * @route /cart/
 * @type {import('express').RequestHandler}
 */
export const getCart = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Cart fetched !',
      data: {
        cart: user.cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST cart
 * @route /cart/
 * @type {import('express').RequestHandler}
 */
export const postCart = async (req, res, next) => {
  try {
    const product = req.body.product;
    const quantity = +req.body.quantity;
    const validation = await User.cartValidation({ product, quantity });

    if (validation !== true) {
      const error = new Error('Validation Error !');
      error.statusCode = 422;
      error.data = validation;
      throw error;
    }

    const user = await User.findOne({ _id: req.user._id });

    const ProductAlreadyExistsInCart = user.cart.find(
      (p) => p.product.toString() === product
    );

    // delete product form cart if product quantity equal to '0'
    if (quantity === 0 && ProductAlreadyExistsInCart) {
      user.cart = user.cart.filter(
        (p) =>
          p.product.toString() !== ProductAlreadyExistsInCart.product.toString()
      );
      await user.save();
    } else {
      if (ProductAlreadyExistsInCart) {
        // update product quantity in cart if product already exists in user cart
        ProductAlreadyExistsInCart.quantity = quantity;
        await user.save();
      } else {
        // insert item to cart if is't already exists in cart
        user.cart.push({ product, quantity });
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Cart updated !',
      data: {
        cart: user.cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT cart
 * @route /cart/:id
 * @type {import('express').RequestHandler}
 */
export const putCart = async (req, res, next) => {
  try {
    const product = await User.exists({
      _id: req.user._id,
      'cart._id': req.params.id,
    });

    if (!product) {
      const error = new Error(
        'Validation Error !. make sure pass cart item "_id" field to params'
      );
      error.statusCode = 422;
      error.data = {};
      throw error;
    }

    const updateResult = await User.updateOne(
      { _id: req.user._id, 'cart._id': req.params.id },
      {
        $set: {
          'cart.$.quantity': req.body.quantity,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully !',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE item from cart
 * @route /cart/:id
 * @type {import('express').RequestHandler}
 */
export const deleteCart = async (req, res, next) => {
  try {
    const product = await User.exists({
      _id: req.user._id,
      'cart._id': req.params.id,
    });

    if (!product) {
      const error = new Error(
        'Validation Error !. make sure pass cart item "_id" field to params'
      );
      error.statusCode = 422;
      error.data = {};
      throw error;
    }

    const updateResult = await User.updateOne(
      { _id: req.user._id },
      {
        $pull: {
          cart: {
            _id: req.params.id,
          },
        },
      }
    );

    res.json({
      success: true,
      message: 'Product deleted from cart !',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE clear cart
 * @route /cart/clear/
 * @type {import('express').RequestHandler}
 */
export const clearCart = async (req, res, next) => {
  try {
    const updateResult = await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          cart: [],
        },
      }
    );

    res.json({
      success: true,
      message: 'All products removed from cart !',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
