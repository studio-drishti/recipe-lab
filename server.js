const mongoose = require('mongoose')
// Load Next.js dependencies and Next Auth config
const next = require('next')
const nextAuth = require('next-auth')
const nextAuthConfig = require('./next-auth.config')

const db = require('./models')

// Load environment variables
// require('dotenv').load()

process.on('uncaughtException', function(err) {
  console.error('Uncaught Exception: ', err)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection: Promise:', p, 'Reason:', reason)
})

// Default when run with `npm start` is 'production' and default port is '80'
// `npm run dev` defaults mode to 'development' & port to '3000'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 80

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schooled-lunch'

// Initialize the Next.js app
const nextApp = next({
  dir: '.',
  dev: (process.env.NODE_ENV !== 'production')
})

nextApp.prepare()
.then(() => {
  // Ensure that we are connected to mongo
  return mongoose.connect(process.env.MONGO_URI)
})
.then(() => {
  // Load configuration and return config object
  return nextAuthConfig()
})
.then(nextAuthOptions => {
  // Don't pass a port to NextAuth so we can use custom express routes
  if (nextAuthOptions.port) delete nextAuthOptions.port

  return nextAuth(nextApp, nextAuthOptions)
})
.then(({ express, expressApp }) => {

  // TODO: Move api routs into a different file
  expressApp.get('/api/recipes', (req, res) => {
    db.Recipe.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      throw err
      res.json(err)
    })
  })

  expressApp.get('/api/recipes/:id', (req, res) => {
    db.Recipe.findOne({'_id': req.params.id})
    .populate('author')
    .then(data => {
      console.log(data)
      res.json(data)
    })
    .catch(err => {
      throw err
      res.json(err)
    })
  })

  expressApp.get('/recipes/:id', (req, res) => {
    const actualPage = '/recipe'
    nextApp.render(req, res, actualPage, req.params)
  })

  expressApp.all('*', (req, res) => {
    let nextRequestHandler = nextApp.getRequestHandler()
    return nextRequestHandler(req, res)
  })

  expressApp.listen(process.env.PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${process.env.PORT}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
