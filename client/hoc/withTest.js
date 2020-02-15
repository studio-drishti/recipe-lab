import React from 'react';
import cuid from 'cuid';
import RecipeContext from '../context/RecipeContext';

function withTest(
  Component,
  recipeOverrides,
  modificationOverrides,
  recipeDispatch,
  modificationDispatch
) {
  const WithTest = props => {
    let recipe = {
      uid: cuid(),
      title: 'Spaghetti and Meatballs',
      author: {
        uid: cuid(),
        name: 'Test McTester'
      },
      time: 'medium',
      skill: 'easy',
      description: "It's food!",
      photos: [],
      items: [
        {
          uid: cuid(),
          name: 'Food thingy',
          steps: [
            {
              uid: cuid(),
              directions: 'Do the first thing',
              ingredients: [
                {
                  uid: cuid(),
                  name: 'wine',
                  quantity: 1,
                  unit: 'cup'
                }
              ]
            },
            {
              uid: cuid(),
              directions: 'Do the second thing',
              ingredients: [
                {
                  uid: cuid(),
                  name: 'wine',
                  quantity: 1,
                  unit: 'cup'
                }
              ]
            }
          ]
        },
        {
          uid: cuid(),
          name: 'Sauce',
          steps: []
        }
      ]
    };
    let modification = {};
    if (recipeOverrides) recipe = Object.assign(recipe, recipeOverrides);
    if (modificationOverrides)
      modification = Object.assign(modification, modificationOverrides);

    return (
      <RecipeContext.Provider
        value={{ recipe, modification, recipeDispatch, modificationDispatch }}
      >
        <Component {...props} />
      </RecipeContext.Provider>
    );
  };
  WithTest.displayName = `withTest(${Component.displayName ||
    Component.name ||
    'Component'})`;
  return WithTest;
}

export default withTest;
