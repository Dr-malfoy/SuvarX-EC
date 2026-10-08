const Category = require('../models/Category');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['order', 'ASC']] });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { slug: req.params.slug } });
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug
};
