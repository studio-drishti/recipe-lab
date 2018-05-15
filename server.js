const express = require('express')
const next = require('next')
const mongoose = require('mongoose')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const db = require('./models')
const seed = require('./models/seed')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/schooled-lunch'
mongoose.connect( MONGO_URL, err => {
  if(err) {
    console.error('Please make sure Mongodb is installed and running!')
    throw error
  } else {
    console.log(`Connected to DB at ${MONGO_URL}`)
  }

  seed();
})

app.prepare()
.then(() => {
  const server = express()

  // TODO: Move api routs into a different file
  server.get('/api/recipes', (req, res) => {
    db.Recipe.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      throw err
      res.json(err)
    })
  })

  server.get('/api/recipes/:id', (req, res) => {
    db.Recipe.findOne({'_id': req.params.id})
    .then(data => {
      console.log(data)
      res.json(data)
    })
    .catch(err => {
      throw err
      res.json(err)
    })
  })

  server.get('/recipes/:id', (req, res) => {
    const actualPage = '/recipe'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
