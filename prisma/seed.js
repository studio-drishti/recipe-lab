const { prisma } = require('../server/generated/prisma-client');
const cuid = require('cuid');

async function main() {
  await prisma.createUser({
    email: 'jay@recipelab.io',
    emailVerified: true,
    name: 'Jay',
    password: '$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m', // "secret42"
    recipes: {
      create: [
        {
          uid: cuid(),
          title: 'Spaghetti and Meatballs',
          time: 'Moderate',
          skill: 'Easy',
          description:
            "It's spaghett! This super easy recipe is delcious, nutritious, and sure to be a crowd pleaser. Rice noodles done right are practically indistinguishable from their glutenfull counterparts.",
          course: 'main',
          items: {
            create: [
              {
                uid: cuid(),
                index: 0,
                name: 'Marinara Sauce',
                steps: {
                  create: [
                    {
                      uid: cuid(),
                      index: 0,
                      directions:
                        "Heat a large pot over medium-high heat. Add 2 tablespoons of the avocado oil, and when it's warm, saute the onion until it's brown and translucent",
                      notes:
                        'Try to cook the onions longer than you think will be necessary. Get them real carmelized. Yum Yum.',
                      ingredients: {
                        create: [
                          {
                            uid: cuid(),
                            index: 0,
                            name: 'avocado oil',
                            quantity: '2',
                            unit: 'tbsp'
                          },
                          {
                            uid: cuid(),
                            index: 1,
                            name: 'medium onion',
                            quantity: '1',
                            processing: 'chopped'
                          }
                        ]
                      }
                    },
                    {
                      uid: cuid(),
                      index: 1,
                      directions:
                        'Add the garlic and italian seasoning. Briefly stir and fry until the mixture is fragrant.',
                      notes: '',
                      ingredients: {
                        create: [
                          {
                            uid: cuid(),
                            index: 0,
                            name: 'garlic cloves',
                            quantity: '2',
                            processing: 'minced'
                          },
                          {
                            uid: cuid(),
                            index: 1,
                            name: 'italian seasoning',
                            quantity: '2',
                            unit: 'tsp'
                          }
                        ]
                      }
                    },
                    {
                      uid: cuid(),
                      index: 2,
                      directions:
                        'Add 1 cup of red wine and simmer the mixture until the liquid has reduced by half.',
                      notes: '',
                      ingredients: {
                        create: [
                          {
                            uid: cuid(),
                            index: 0,
                            name: 'red wine',
                            quantity: '1',
                            unit: 'cup'
                          }
                        ]
                      }
                    },
                    {
                      uid: cuid(),
                      index: 3,
                      directions:
                        'Add the remaining red wine, chicken stock, and tomato puree.',
                      notes: '',
                      ingredients: {
                        create: [
                          {
                            uid: cuid(),
                            index: 0,
                            name: 'red wine',
                            quantity: '1',
                            unit: 'cup'
                          },
                          {
                            uid: cuid(),
                            index: 1,
                            name: 'chicken stock',
                            quantity: '1/2',
                            unit: 'cup'
                          },
                          {
                            uid: cuid(),
                            index: 2,
                            name: '28-ounce can whole peeled tomatoes',
                            quantity: '1',
                            processing: 'blended into a puree'
                          }
                        ]
                      }
                    },
                    {
                      uid: cuid(),
                      index: 4,
                      directions:
                        'Make spaghetti noodles according to package instructions.',
                      notes: '',
                      ingredients: {
                        create: [
                          {
                            uid: cuid(),
                            index: 0,
                            name: 'gulten-free spaghetti',
                            quantity: '1',
                            unit: 'lb'
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                uid: cuid(),
                index: 1,
                name: 'Meatballs',
                steps: {
                  create: [
                    {
                      uid: cuid(),
                      index: 0,
                      directions: 'Preheat the oven to 350 F'
                    },
                    {
                      uid: cuid(),
                      index: 1,
                      directions:
                        'Stir together all the ingredients for the meatballs until they are well combined.',
                      ingredients: {
                        create: [
                          {
                            uid: cuid(),
                            index: 0,
                            quantity: '1',
                            unit: 'lb',
                            name: 'ground beef'
                          },
                          {
                            uid: cuid(),
                            index: 1,
                            quantity: '1/4',
                            unit: 'cup',
                            name: 'onion',
                            processing: 'minced'
                          },
                          {
                            uid: cuid(),
                            index: 2,
                            quantity: '1',
                            name: 'egg'
                          },
                          {
                            uid: cuid(),
                            index: 3,
                            quantity: '1',
                            unit: 'tbsp',
                            name: 'chia seeds'
                          },
                          {
                            uid: cuid(),
                            index: 4,
                            quantity: '2',
                            unit: 'tbsp',
                            name: 'almond flour'
                          },
                          {
                            uid: cuid(),
                            index: 5,
                            quantity: '1/4',
                            unit: 'cup',
                            name: 'parsley'
                          },
                          {
                            uid: cuid(),
                            index: 6,
                            quantity: '2',
                            unit: 'tsp',
                            name: 'sea salt'
                          },
                          {
                            uid: cuid(),
                            index: 7,
                            quantity: '1/4',
                            unit: 'tsp',
                            name: 'black pepper',
                            processing: 'freshly ground'
                          }
                        ]
                      }
                    },
                    {
                      uid: cuid(),
                      index: 2,
                      directions:
                        'Using your hands, form even size balls, about the size of golf balls, and set them aside. Heat another few tablespoons of avocado oil in an ovenproof saute pan. When the oil is hot, add the meatballs and brown them about 2 minutes on each side before transferring the pan to the oven. Cook them for about 10 minutes.',
                      ingredients: {
                        create: [
                          {
                            uid: cuid(),
                            index: 0,
                            quantity: '2',
                            unit: 'tbsp',
                            name: 'avocado oil'
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  });

  await prisma.createUser({
    email: 'emma@recipelab.io',
    emailVerified: true,
    name: 'Emma',
    password: '$2b$10$dqyYw5XovLjpmkYNiRDEWuwKaRAvLaG45fnXE5b3KTccKZcRPka2m' // "secret42"
  });
}

main();
