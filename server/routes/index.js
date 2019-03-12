const router = require('express').Router();
const healthzRoute = require('./healthz');

// Healthz
router.use('/healthz', healthzRoute);

module.exports = router;
