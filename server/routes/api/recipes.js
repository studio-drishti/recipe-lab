const router = require('express').Router();

const db = require('../../models');

// Matches /api/recipes
router.get('/', (req, res) => {
  db.Recipe.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      throw err;
      res.json(err);
    });
});

// Matches /api/recipes/:id
router.get('/:id', (req, res) => {
  db.Recipe.findOne({ _id: req.params.id })
    .populate('author')
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      throw err;
      res.json(err);
    });
});

module.exports = router;
