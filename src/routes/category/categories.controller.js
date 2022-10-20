import Category from '../../models/category.js';

/**
 * GET categories
 * @route /categories/
 * @type {import('express').RequestHandler}
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select('-__v');

    res.status(200).json({
      success: true,
      message: 'Categories fetched !',
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET category
 * @route /categories/
 * @type {import('express').RequestHandler}
 */
export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id }).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Category fetched !',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST category
 * @route /categories/
 * @type {import('express').RequestHandler}
 */
export const postCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const validation = await Category.categoryValidation({ name });

    if (validation !== true) {
      const error = new Error('Validation Error !');
      error.statusCode = 422;
      error.data = validation;
      throw error;
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully !',
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};
