const signup = require('./signup');
const login = require('./login');
const avatarUpload = require('./avatarUpload');
const recipePhotoUpload = require('./recipePhotoUpload');
const recipePhotoDelete = require('./recipePhotoDelete');
const saveModification = require('./saveModification');
const createRecipe = require('./createRecipe');
const updateUser = require('./updateUser');

module.exports = {
  signup,
  login,
  avatarUpload,
  recipePhotoUpload,
  recipePhotoDelete,
  saveModification,
  createRecipe,
  updateUser
};
