import mongoose from 'mongoose';
import Order from '../../models/order.js';
import User from '../../models/user.js';

/**
 * GET orders
 * @route /orders/
 * @type {import('express').RequestHandler}
 */
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.json({
      success: true,
      message: 'Orders fetched !',
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET orders
 * @route /orders/
 * @type {import('express').RequestHandler}
 */
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      user: req.user._id,
      _id: req.params.id,
    });

    if (!order) {
      const error = new Error('No orders found !');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Order fetched !',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST orders
 * @route /orders/
 * @type {import('express').RequestHandler}
 */
export const postOrders = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate(
      'cart.product'
    );

    if (user.cart.length === 0) {
      return res.json({
        success: false,
        message: 'Cart is empty !',
        data: {
          cart: user.cart,
        },
      });
    }

    const validation = await Order.orderValidation({
      products: user.cart,
      status: 'pending',
    });

    if (validation !== true) {
      const error = new Error('Validation Error !');
      error.statusCode = 422;
      error.data = validation;
      throw error;
    }

    const order = await Order.create({
      user: req.user._id,
      products: user.cart,
      status: 'pending',
      totalPrice: user.cart.reduce(
        (prev, cur) => prev + cur.product.price * cur.quantity,
        0
      ),
    });

    /* const aggregation = await Order.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'populatedProducts',
        },
      },
      {
        $match: {
          user: mongoose.Types.ObjectId(req.user._id),
          _id: order._id,
        },
      },
      {
        $unwind: {
          path: '$products',
        },
      },
      {
        $unwind: {
          path: '$populatedProducts',
        },
      },
      {
        $project: {
          _id: '$_id',
          quantity: '$products.quantity',
          price: '$populatedProducts.price',
        },
      },
      {
        $project: {
          total: {
            $sum: {
              $multiply: ['$quantity', '$price'],
            },
          },
        },
      },
    ]); */

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart products moved to orders !',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE order
 * @route /orders/:id
 * @type {import('express').RequestHandler}
 */
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.deleteOne({ _id: req.params.id });

    if (order.deletedCount === 0) {
      const error = new Error('Cannot delete order !');
      error.statusCode = 400;
      throw error;
    }

    res.json({
      success: true,
      message: 'Order remove successfully !',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT order
 * @route /orders/:id
 * @type {import('express').RequestHandler}
 */
export const putOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });

    if (!order) {
      const error = new Error('No order found !');
      error.statusCode = 404;
      throw error;
    }

    const { quantity, product } = req.body;

    const ProductExistsInOrder = order.products.find(
      (p) => p.product.toString() === product
    );

    if (!ProductExistsInOrder) {
      const error = new Error('No Product Found !');
      error.statusCode = 404;
      throw error;
    }

    // delete product form cart if product quantity equal to '0'
    if (quantity === 0) {
      order.products = order.products.filter(
        (p) => p.product.toString() !== ProductExistsInOrder.product.toString()
      );
      await order.save();
    } else {
      // update product quantity in cart if product already exists in user cart
      ProductExistsInOrder.quantity = quantity;
      await order.save();
    }

    res.json({
      success: true,
      message: 'Order updated successfully !',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};
