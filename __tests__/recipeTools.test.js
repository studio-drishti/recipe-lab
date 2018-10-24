import { stepsToIngredientTotals, sortIngredientQuantites } from 'schooled-lunch/util/recipeTools';

describe("Refactor step based ingredients as total ingredients", () => {
  it('should return false when not an array', () => {
    expect(stepsToIngredientTotals('string')).toEqual(false);
    expect(stepsToIngredientTotals({})).toEqual(false);
    expect(stepsToIngredientTotals(1)).toEqual(false);
  })

  it('should return 2 cups wine, divided', () => {
    const totals = stepsToIngredientTotals([
      {
        ingredients: [
          {
            name: 'wine',
            quantity: 1,
            unit: 'cup',
          },
        ],
      },
      {
        ingredients: [
          {
            name: 'wine',
            quantity: 1,
            unit: 'cup',
          },
        ]
      },
    ])
    expect(totals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'wine',
          divided: true,
          quantities: [
            {
              unit: 'cup',
              quantity: 2,
            }
          ]
        })
      ])
    )
  })

  it('should sort cups before tbsp', () => {
    const sortedQtys = sortIngredientQuantites([
      {
        quantity: 3.5,
        unit: 'tbsp',
      },
      {
        quantity: 1,
        unit: 'cup',
      },
    ])
    expect(sortedQtys).toEqual([
      {
        quantity: 1,
        unit: 'cup',
      },
      {
        quantity: 3.5,
        unit: 'tbsp',
      },
    ])
  })
})
