const router = require('express').Router();
const apiRoutes = require('./api');
const healthzRoute = require('./healthz');

// API Routes
router.use('/api', apiRoutes);

// Healthz
router.use('/healthz', healthzRoute);

module.exports = router;
