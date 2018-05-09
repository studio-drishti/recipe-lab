module.exports = [
  {
    id: 0,
    title: 'Spaghetti and Meatballs',
    author: 'The Curnielswensens',
    source: 'Clean Eats',
    time: 'medium',
    skill: 'easy',
    yields: {
      quantity: 4,
      unit: "servings"
    },
    tags: [
      'Gluten Free',
    ],
    images: [
      'https://media.giphy.com/media/ToMjGpyWnjWUZbfi7rq/giphy.gif',
    ],
    description: `It's spaghett! This super easy recipe is delcious,
                  nutritious, and sure to be a crowd pleaser.
                  Rice noodles done right are practically indistinguishable
                  from their glutenfull counterparts.`,
    type: 'main',
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
            notes: 'plus another few tablespoons for cooking the meatballs',
          },
          {
            name: 'medium onion',
            quantity: 1,
            unit: '',
            toTaste: false,
            processing: 'chopped',
            notes: 'Preferablly red, but brown onions work just as well.',
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
            notes: '',
          },
          {
            name: 'italian seasoning',
            quantity: 2,
            unit: 'tsp',
            toTaste: false,
            processing: '',
            notes: '',
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
            notes: '',
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
            notes: '',
          },
          {
            name: 'chicken stock',
            quantity: 0.5,
            unit: 'cup',
            toTaste: false,
            processing: '',
            notes: '',
          },
          {
            name: '28-ounce can whole peeled tomatoes',
            quantity: 1,
            unit: '',
            toTaste: false,
            processing: 'blended into a puree',
            notes: '',
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
            notes: '',
          },
        ],
      },
    ],
  },
]
