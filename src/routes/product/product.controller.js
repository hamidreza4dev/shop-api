import Category from "../../models/category.js";
import Order from "../../models/order.js";
import Product from "../../models/product.js";
import User from "../../models/user.js";
import deleteFile from "../../utils/deleteFiles.js";
import { uploadFile } from "../../utils/uploadFile.js";

/**
 * GET products
 * @route /products/
 * @type {import('express').RequestHandler}
 */
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.json({
      success: true,
      message: "Products Fetched !",
      data: {
        products,
        total: products.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET products
 * @route /products/:id
 * @type {import('express').RequestHandler}
 */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      const error = new Error("No Product found !");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: "Product Fetched !",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST product
 * @route /products/
 * @type {import('express').RequestHandler}
 */
export const postProduct = async (req, res, next) => {
  try {
    const { title, description, category, status = "public" } = req.body;
    const price = +req.body.price;
    // validate user input
    const validation = await Product.validateProduct({
      title,
      description,
      category,
      status,
      image: req.file,
      price,
    });

    if (validation !== true) {
      const error = new Error("Validation Error !");
      error.data = validation;
      error.statusCode = 422;
      throw error;
    }

    // upload image to images folder with jpg or png format
    const uploadedFile = await uploadFile({
      type: "image",
      folder: "images",
      file: req.file,
      format: req.file.mimetype.split("/").pop(),
    });

    // resolve categories and flatten (names) categories
    const categories = await Category.find();
    const flattenCategories = categories.map((item) => item.name);

    // resolve witch categories that users sent is not in our database
    const unResolvedCategories = category.filter(
      (item) => !flattenCategories.includes(item)
    );

    if (unResolvedCategories.length > 0) {
      const error = new Error(
        "They are some un resolved categories, please first create theme !"
      );
      error.statusCode = 422;
      error.data = {
        unResolvedCategories,
      };
      throw error;
    }

    // create product
    const product = await Product.create({
      title,
      description,
      category: categories
        .filter((c) => category.includes(c.name))
        .map((c) => c._id),
      status,
      user: req.user._id,
      image: uploadedFile.filepath,
      price,
    });

    // update category count
    await Category.updateMany(
      {
        name: {
          $in: flattenCategories,
        },
      },
      {
        $inc: {
          count: 1,
        },
      }
    );

    res.status(201).json({
      success: true,
      message: "Product Created Successfully !",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE product
 * @route /products/
 * @type {import('express').RequestHandler}
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      const error = new Error("Product not found !");
      error.statusCode = 404;
      throw error;
    }

    const productUpdateResult = await User.updateMany(
      {
        "cart.product": product._id,
      },
      {
        $pull: {
          cart: {
            product: product._id,
          },
        },
      }
    );

    const orderUpdateResult = await Order.updateMany(
      {
        "products.product": product._id,
      },
      {
        $pull: {
          products: {
            product: product._id,
          },
        },
      }
    );

    await deleteFile(product.image).catch((err) => {
      const error = new Error("Error while deleting file !");
      error.statusCode = 500;
      throw error;
    });
    await product.delete();

    res.json({
      success: true,
      message: "Product Deleted Successfully !",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT product
 * @route /products/
 * @type {import('express').RequestHandler}
 */
export const putProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      const error = new Error("Product not found !");
      error.statusCode = 404;
      throw error;
    }

    const { title, description, category, price, status } = req.body;

    const validation = await Product.validateEditProduct({
      title,
      description,
      category,
      price,
      status,
      ...(req.file && { image: req.file }),
    });

    if (validation !== true) {
      const error = new Error("Validation Error !");
      error.statusCode = 422;
      error.data = validation;
      throw error;
    }

    // upload image to images folder with jpg or png format
    let uploadedFile;
    if (req.file) {
      uploadedFile = await uploadFile({
        type: "image",
        folder: "images",
        file: req.file,
        format: req.file.mimetype.split("/").pop(),
      });

      await deleteFile(product.image).catch((err) => {
        const error = new Error("Error while deleting file !");
        error.statusCode = 500;
        throw error;
      });
    }

    title && (product.title = title);
    description && (product.description = description);
    status && (product.status = status);

    // resolve categories and flatten (names) categories
    const categories = await Category.find();
    if (category && category.length > 0) {
      const flattenCategories = categories.map((item) => item.name);

      // resolve witch categories that users sent is not in our database
      const unResolvedCategories = category.filter(
        (item) => !flattenCategories.includes(item)
      );

      if (unResolvedCategories.length > 0) {
        const error = new Error(
          "They are some un resolved categories, please first create theme !"
        );
        error.statusCode = 422;
        error.data = {
          unResolvedCategories,
        };
        throw error;
      }
    }

    category &&
      category.length > 0 &&
      (product.category = categories
        .filter((c) => category.includes(c.name))
        .map((c) => c._id));
    req.file && (product.image = uploadedFile.filepath);

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully !",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};
