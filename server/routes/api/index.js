const router = require("express").Router();
const recipeRoutes = require("./recipes");

// Recipe routes
router.use("/recipes", recipeRoutes);

module.exports = router;
