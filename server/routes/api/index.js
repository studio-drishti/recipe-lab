const router = require('express').Router();
const avatarRoutes = require('./avatars');

// Recipe routes
router.use('/avatars', avatarRoutes);

module.exports = router;
