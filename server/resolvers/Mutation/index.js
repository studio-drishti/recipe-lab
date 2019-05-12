const signup = require('./signup');
const login = require('./login');
const avatarUpload = require('./avatarUpload');
const recipePhotoUpload = require('./recipePhotoUpload');
const recipePhotoDelete = require('./recipePhotoDelete');
const recipePhotoOrder = require('./recipePhotoOrder');
const saveModification = require('./saveModification');

module.exports = {
  signup,
  login,
  avatarUpload,
  recipePhotoUpload,
  recipePhotoDelete,
  saveModification,
  recipePhotoOrder
};
