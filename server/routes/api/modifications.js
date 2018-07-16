const router = require("express").Router()

const db = require("../../models")

// Matches /api/modifications
router.get('/', (req, res) => {
  const query = {}
  // if(req.query.recipe) {
  //   query.recipe = req.query.recipe
  // }
  db.Modification.find(query)
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      throw err
      res.json(err)
    })
})

module.exports = router;
