const mongoose = require('mongoose');
const logger = require('../logger');
const db = require('../models');

process.env.MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/schooled-lunch';

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    return db.Recipe.deleteMany({}).then(() => db.User.deleteMany({}));
  })
  .then(() => {
    return db.User.create([
      {
        name: 'Jay',
        email: 'jay@schooledlunch.club',
        emailVerified: true
      },
      {
        name: 'Emma',
        email: 'emma@schooledlunch.club',
        emailVerified: true
      }
    ]);
  })
  .then(users => {
    users.forEach(user => {
      logger.info('Created User: ', user.name);
    });

    const marinara = {
      name: 'Marinara Sauce',
      steps: [
        {
          directions:
            "Heat a large pot over medium-high heat. Add 2 tablespoons of the avocado oil, and when it's warm, saute the onion until it's brown and translucent",
          notes:
            'Try to cook the onions longer than you think will be necessary. Get them real carmelized. Yum Yum.',
          ingredients: [
            {
              name: 'avocado oil',
              quantity: 2,
              unit: 'tbsp'
            },
            {
              name: 'medium onion',
              quantity: 1,
              processing: 'chopped'
            }
          ]
        },
        {
          directions:
            'Add the garlic and italian seasoning. Briefly stir and fry until the mixture is fragrant.',
          notes: '',
          ingredients: [
            {
              name: 'garlic cloves',
              quantity: 2,
              processing: 'minced'
            },
            {
              name: 'italian seasoning',
              quantity: 2,
              unit: 'tsp'
            }
          ]
        },
        {
          directions:
            'Add a 1 cup of red wine and simmer the mixture until the liquid has reduced by half.',
          notes: '',
          ingredients: [
            {
              name: 'red wine',
              quantity: 1,
              unit: 'cup'
            }
          ]
        },
        {
          directions:
            'Add the remaining red wine, chicken stock, and tomato puree.',
          notes: '',
          ingredients: [
            {
              name: 'red wine',
              quantity: 1,
              unit: 'cup'
            },
            {
              name: 'chicken stock',
              quantity: 0.5,
              unit: 'cup'
            },
            {
              name: '28-ounce can whole peeled tomatoes',
              quantity: 1,
              processing: 'blended into a puree'
            }
          ]
        },
        {
          directions:
            'Make spaghetti noodles according to package instructions.',
          notes: '',
          ingredients: [
            {
              name: 'gulten-free spaghetti',
              quantity: 1,
              unit: 'lb'
            }
          ]
        }
      ]
    };

    const meatballs = {
      name: 'Meatballs',
      steps: [
        {
          directions: 'Preheat the oven to 350 F'
        },
        {
          directions:
            'Stir together all the ingredients for the meatballs until they are well combined.',
          ingredients: [
            {
              quantity: 1,
              unit: 'lb',
              name: 'ground beef'
            },
            {
              quantity: 0.25,
              unit: 'cup',
              name: 'onion',
              processing: 'minced'
            },
            {
              quantity: 1,
              name: 'egg'
            },
            {
              quantity: 1,
              unit: 'tbsp',
              name: 'chia seeds'
            },
            {
              quantity: 2,
              unit: 'tbsp',
              name: 'almond flour'
            },
            {
              quantity: 0.25,
              unit: 'cup',
              name: 'parsley'
            },
            {
              quantity: 2,
              unit: 'tsp',
              name: 'sea salt'
            },
            {
              quantity: 0.25,
              unit: 'tsp',
              name: 'black pepper',
              processing: 'freshly ground'
            }
          ]
        },
        {
          directions:
            'Using your hands, form even size balls, about the size of golf balls, and set them aside. Heat another few tablespoons of avocado oil in an ovenproof saute pan. When the oil is hot, add the meatballs and brown them about 2 minutes on each side before transferring the pan to the oven. Cook them for about 10 minutes.',
          ingredients: [
            {
              quantity: 2,
              unit: 'tbsp',
              name: 'avocado oil'
            }
          ]
        }
      ]
    };

    return db.Recipe.create({
      title: 'Spaghetti and Meatballs',
      author: users[0]._id,
      time: 'medium',
      skill: 'easy',
      description:
        "It's spaghett! This super easy recipe is delcious, nutritious, and sure to be a crowd pleaser. Rice noodles done right are practically indistinguishable from their glutenfull counterparts.",
      course: 'main',
      items: [marinara, meatballs]
    });
  })
  .then(recipe => {
    logger.info('Created Recipe: ', recipe.title);
    mongoose.connection.close();
  })
  .catch(ex => {
    logger.error(ex.stack);
    throw "Couldn't create recipe";
  });
