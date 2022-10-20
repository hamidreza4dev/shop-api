import Category from '../../models/category.js';
import Product from '../../models/product.js';
import { uploadFile } from '../../utils/uploadFile.js';

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
      message: 'Products Fetched !',
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
 * POST product
 * @route /products/
 * @type {import('express').RequestHandler}
 */
export const postProduct = async (req, res, next) => {
  try {
    const { title, description, category, status = 'public' } = req.body;
    // validate user input
    const validation = await Product.validateProduct({
      title,
      description,
      category,
      status,
      image: req.file,
    });

    if (validation !== true) {
      const error = new Error('Validation Error !');
      error.data = validation;
      error.statusCode = 422;
      throw error;
    }

    // upload image to images folder with jpg or png format
    const uploadedFile = await uploadFile({
      type: 'image',
      folder: 'images',
      file: req.file,
      format: req.file.mimetype.split('/').pop(),
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
        'They are some un resolved categories, please first create theme !'
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
      category: categories.map((item) => item._id),
      status,
      user: req.user._id,
      image: uploadedFile.filepath,
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
      message: 'Product Created Successfully !',
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};
