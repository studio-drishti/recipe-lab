const mongoose = require('mongoose')

const Recipe = require('./Recipe')
const User = require('./User');

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schooled-lunch'

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  return Recipe.deleteMany({}).then(() => User.deleteMany({}))
})
.then(() => {
  return User.create([
    {
      name: 'Jay',
      email: 'jay@schooledlunch.club',
      emailVerified: true,
    },
    {
      name: 'Emma',
      email: 'emma@schooledlunch.club',
      emailVerified: true,
    },
  ])
})
.then(users => {
  users.forEach(user => {
    console.log("Created User: ", user.name)
  })

  return Recipe.create({
    title: 'Spaghetti and Meatballs',
    author: users[0]._id,
    // source: 'Clean Eats',
    time: 'medium',
    skill: 'easy',
    // yields: {
    //   quantity: 4,
    //   unit: "servings"
    // },
    // tags: [
    //   'Gluten Free',
    // ],
    // images: [
    //   'https://media.giphy.com/media/ToMjGpyWnjWUZbfi7rq/giphy.gif',
    // ],
    description: `It's spaghett! This super easy recipe is delcious,
                  nutritious, and sure to be a crowd pleaser.
                  Rice noodles done right are practically indistinguishable
                  from their glutenfull counterparts.`,
    course: 'main',
    steps: [
      {
        directions: 'Preheat the oven to 350 F',
        notes: '',
        ingredients: [],
      },
      {
        directions: `Heat a large pot over medium-high heat. Add 2 tablespoons of the avocado oil, and when it's warm, saute the onion until it's brown and translucent`,
        notes: 'Try to cook the onions longer than you think will be necessary. Get them real carmelized. Yum Yum.',
        ingredients: [
          {
            name: 'avocado oil',
            quantity: 2,
            unit: 'tbsp',
            toTaste: false,
            processing: '',
          },
          {
            name: 'medium onion',
            quantity: 1,
            unit: '',
            toTaste: false,
            processing: 'chopped',
          },
        ],
      },
      {
        directions: `Add the garlic and italian seasoning. Briefly stir and fry until the mixture is fragrant.`,
        notes: '',
        ingredients: [
          {
            name: 'garlic cloves',
            quantity: 2,
            unit: '',
            toTaste: false,
            processing: 'minced',
          },
          {
            name: 'italian seasoning',
            quantity: 2,
            unit: 'tsp',
            toTaste: false,
            processing: '',
          },
        ],
      },
      {
        directions: `Add a 1 cup of red wine and simmer the mixture until the liquid has reduced by half.`,
        notes: '',
        ingredients: [
          {
            name: 'red wine',
            quantity: 1,
            unit: 'cup',
            toTaste: false,
            processing: '',
          },
        ],
      },
      {
        directions: `Add the remaining red wine, chicken stock, and tomato puree.`,
        notes: '',
        ingredients: [
          {
            name: 'red wine',
            quantity: 1,
            unit: 'cup',
            toTaste: false,
            processing: '',
          },
          {
            name: 'chicken stock',
            quantity: 0.5,
            unit: 'cup',
            toTaste: false,
            processing: '',
          },
          {
            name: '28-ounce can whole peeled tomatoes',
            quantity: 1,
            unit: '',
            toTaste: false,
            processing: 'blended into a puree',
          },
        ]
      },
      {
        directions: 'Make spaghetti noodles according to package instructions.',
        notes: '',
        ingredients: [
          {
            name: 'gulten-free spaghetti',
            quantity: 1,
            unit: 'lb',
            toTaste: false,
            processing: '',
          },
        ],
      },
    ],
  })
})
.then(recipe => {
  console.log('Created Recipe: ', recipe.title)
  mongoose.connection.close()
})
.catch(ex => {
  console.error(ex.stack)
  process.exit(1)
})
