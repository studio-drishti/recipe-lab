const router = require('express').Router();
const recipeRoutes = require('./recipes');
const modificationRoutes = require('./modifications');
const avatarRoutes = require('./avatars');

// Recipe routes
router.use('/recipes', recipeRoutes);
router.use('/modifications', modificationRoutes);
router.use('/avatars', avatarRoutes);

module.exports = router;
