const router = require('express').Router();
const recipeRoutes = require('./recipes');
const modificationRoutes = require('./modifications');

// Recipe routes
router.use('/recipes', recipeRoutes);
router.use('/modifications', modificationRoutes);

module.exports = router;
