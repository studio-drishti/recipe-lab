export const setModification = (modification, dispatch) =>
  dispatch({
    type: 'SET_MODIFICATION',
    payload: modification,
  });

export const setAlteration = (source, field, value, dispatch) =>
  dispatch({
    type: 'kind' in source ? 'SET_ADDITION' : 'SET_ALTERATION',
    payload: { source, field, value },
  });

export const removeItem = (item, dispatch) =>
  dispatch({
    type: 'kind' in item ? 'REMOVE_ITEM' : 'ADD_REMOVAL',
    payload: item,
  });

export const removeStep = (step, dispatch) =>
  dispatch({
    type: 'kind' in step ? 'REMOVE_STEP' : 'ADD_REMOVAL',
    payload: step,
  });

export const removeIngredient = (ingredient, dispatch) =>
  dispatch({
    type: 'kind' in ingredient ? 'REMOVE_INGREDIENT' : 'ADD_REMOVAL',
    payload: ingredient,
  });

export const undoRemoval = (source, dispatch) =>
  dispatch({
    type: 'UNDO_REMOVAL',
    payload: source,
  });

export const createItem = (recipeId, items, index, dispatch) =>
  dispatch({
    type: 'CREATE_ITEM',
    payload: { recipeId, items, index },
  });

export const createStep = (itemId, steps, index, dispatch) =>
  dispatch({
    type: 'CREATE_STEP',
    payload: { itemId, steps, index },
  });

export const createIngredient = (stepId, dispatch) =>
  dispatch({
    type: 'CREATE_INGREDIENT',
    payload: { stepId },
  });

export const setSorting = (
  parentId,
  unsorted,
  sourceI,
  destinationI,
  dispatch
) =>
  dispatch({
    type: 'SET_SORTING',
    payload: {
      sourceI,
      destinationI,
      parentId,
      unsorted,
    },
  });
