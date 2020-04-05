const signup = require('./signup');
const login = require('./login');
const avatarUpload = require('./avatarUpload');
const avatarDelete = require('./avatarDelete');
const recipePhotoUpload = require('./recipePhotoUpload');
const recipePhotoDelete = require('./recipePhotoDelete');
const saveModification = require('./saveModification');
const createRecipe = require('./createRecipe');
const updateUser = require('./updateUser');
const publishRecipe = require('./publishRecipe');

module.exports = {
  signup,
  login,
  avatarUpload,
  avatarDelete,
  recipePhotoUpload,
  recipePhotoDelete,
  saveModification,
  createRecipe,
  updateUser,
  publishRecipe
};
