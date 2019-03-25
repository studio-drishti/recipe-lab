import { shallow } from 'enzyme';
import React from 'react';

import Recipe from 'recipe-lab/client/components/Recipe';
import cuid from 'cuid';

let props, localStoreId;

beforeEach(() => {
  props = {
    recipe: {
      uid: cuid(),
      title: 'Spaghetti and Meatballs',
      author: {
        uid: cuid(),
        name: 'Test McTester'
      },
      time: 'medium',
      skill: 'easy',
      description: "It's food!",
      course: 'main',
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
    }
  };
  localStoreId = `MOD-${props.recipe.uid}`;
  localStorage.clear();
  localStorage.setItem.mockClear();
});

describe('It saves alterations', () => {
  test('saves an alteration to localstorage', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    instance.saveAlteration(props.recipe, 'title', 'Milk Steak');
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorage.__STORE__[localStoreId])).toEqual(
      expect.objectContaining({
        alterations: expect.arrayContaining([
          expect.objectContaining({
            sourceId: props.recipe.uid,
            field: 'title',
            value: 'Milk Steak'
          })
        ])
      })
    );
  });

  test('does not save alterations that are same as source', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    instance.saveAlteration(props.recipe, 'title', props.recipe.title);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  test('removes an alteration if updated value is same as source', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const originalTitle = String(props.recipe.title);

    instance.saveAlteration(props.recipe, 'title', 'Milk Steak');
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).alterations
    ).toHaveLength(1);

    instance.saveAlteration(props.recipe, 'title', originalTitle);
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).alterations
    ).toHaveLength(0);
  });
});

describe('It saves removals', () => {
  test('saves removal to localstorage', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();

    instance.saveRemoval(props.recipe.items[0]);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorage.__STORE__[localStoreId])).toEqual(
      expect.objectContaining({
        removals: expect.arrayContaining([props.recipe.items[0].uid])
      })
    );
  });
});

describe('It saves sorting', () => {
  test('saves sorting to localstorage', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { recipe } = instance.state;

    instance.saveSorting(recipe.uid, recipe.items, recipe.items.length - 1, 0);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).sortings[0].order[0]
    ).toEqual(recipe.items[recipe.items.length - 1].uid);
  });

  test('removes sorting mod if same as source', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { recipe } = instance.state;

    instance.saveSorting(recipe.uid, recipe.items, recipe.items.length - 1, 0);
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).sortings
    ).toHaveLength(1);

    instance.saveSorting(recipe.uid, recipe.items, 0, recipe.items.length - 1);
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).sortings
    ).toHaveLength(0);
  });
});

describe('It creates additions', () => {
  test('creates a new ingredient', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { additions } = instance.state.modification;

    instance.createIngredient(props.recipe.items[0].steps[0].uid);

    expect(additions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uid: expect.any(String),
          parentId: props.recipe.items[0].steps[0].uid,
          kind: 'Ingredient'
        })
      ])
    );
  });

  test('creates a new step', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { additions } = instance.state.modification;

    instance.createStep(props.recipe.items[0].uid);

    expect(additions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uid: expect.any(String),
          parentId: props.recipe.items[0].uid,
          kind: 'Step'
        })
      ])
    );
  });

  test('creates a new item', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { additions } = instance.state.modification;

    instance.createItem();

    expect(additions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uid: expect.any(String),
          parentId: props.recipe.uid,
          kind: 'Item'
        })
      ])
    );
  });
});
