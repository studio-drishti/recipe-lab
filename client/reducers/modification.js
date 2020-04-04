import cuid from 'cuid';
import reorder from '../utils/reorder';
import areArraysEqual from '../utils/areArraysEqual';
import { getSorted } from '../utils/recipe';

export default (state, action) => {
  switch (action.type) {
    case 'SET_MODIFICATION':
      return { ...state, ...action.payload };
    case 'SET_ALTERATION': {
      const { source, field, value } = action.payload;
      const { alterations } = state;
      const alterationIndex = alterations.findIndex(
        alteration =>
          alteration.field === field && alteration.sourceId === source.uid
      );
      const alterationExists = alterationIndex > -1;

      /**
       * If alteration does not exist and source value
       * is the same as the incoming value, bail.
       */
      if (!alterationExists && source[field] === value) return state;

      /**
       * 1. If alteration exists and source value is
       *    the same as incoming value, remove it.
       * 2. Else if alteration exists and source value
       *    does not match incoming value, update the value
       * 3. Else alteration does not exist, so create a new entry
       */
      if (alterationExists && source[field] === value) {
        alterations.splice(alterationIndex, 1);
      } else if (alterationExists) {
        alterations[alterationIndex].value = value;
      } else {
        alterations.push({
          uid: cuid(),
          sourceId: source.uid,
          field,
          value
        });
      }
      return {
        ...state,
        alterations,
        sessionCount: state.sessionCount + 1
      };
    }
    case 'SET_ADDITION': {
      const { source, field, value } = action.payload;
      const { additions } = state;
      const index = additions.findIndex(
        addition => addition.uid === source.uid
      );

      if (index === -1) return state;

      additions[index][field] = value;

      return {
        ...state,
        additions,
        sessionCount: state.sessionCount + 1
      };
    }
    case 'REMOVE_ITEM': {
      const item = action.payload;
      const { additions } = state;
      /**
       * REMOVE_ITEM is only ever called on additions
       * therefore we know all of its children are additions too.
       * so delete item, steps, and ingredient additions.
       */
      const steps = additions.filter(
        addition => addition.parentId === item.uid
      );
      const ingredients = steps.flatMap(step =>
        additions.filter(addition => addition.parentId === step.uid)
      );
      const toRemove = [item, ...steps, ...ingredients].map(
        addition => addition.uid
      );
      return {
        ...state,
        additions: additions.filter(
          addition => !toRemove.includes(addition.uid)
        ),
        sessionCount: state.sessionCount + 1
      };
    }
    case 'REMOVE_STEP': {
      const step = action.payload;
      const { additions } = state;
      /**
       * REMOVE_STEP is only ever called on additions
       * therefore we know all of its children are additions too.
       * so delete all steps and ingredient additions.
       */
      const ingredients = additions.filter(
        addition => addition.parentId === step.uid
      );
      const toRemove = [step, ...ingredients].map(addition => addition.uid);
      return {
        ...state,
        additions: additions.filter(
          addition => !toRemove.includes(addition.uid)
        ),
        sessionCount: state.sessionCount + 1
      };
    }
    case 'REMOVE_INGREDIENT': {
      const ingredient = action.payload;
      const { additions } = state;
      /**
       * REMOVE_INGREDIENT is only ever called on additions
       * therefore we can delete it completely.
       */
      return {
        ...state,
        additions: additions.filter(
          addition => addition.uid !== ingredient.uid
        ),
        sessionCount: state.sessionCount + 1
      };
    }
    case 'ADD_REMOVAL': {
      const source = action.payload;
      const { removals, alterations } = state;

      /**
       * Source already removed, so bail.
       */
      if (removals.includes(source.uid)) return state;

      /**
       * add the new removal ID and
       * clear any saved alterations related to the source
       */
      return {
        ...state,
        removals: [...state.removals, source.uid],
        alterations: alterations.filter(mod => mod.sourceId !== source.uid),
        sessionCount: state.sessionCount + 1
      };
    }
    case 'UNDO_REMOVAL': {
      const sources = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      const { removals } = state;
      return {
        ...state,
        removals: removals.filter(uid => !sources.includes(uid)),
        sessionCount: state.sessionCount + 1
      };
    }
    case 'CREATE_ITEM': {
      const { recipeId, items, index } = action.payload;
      const { sortings } = state;

      const addition = {
        uid: cuid(),
        kind: 'Item',
        parentId: recipeId,
        name: '',
        processing: ''
      };

      const order = getSorted(items, sortings, recipeId).map(item => item.uid);
      order.splice(index + 1, 0, addition.uid);
      const sortingIndex = sortings.findIndex(
        sorting => sorting.parentId === recipeId
      );
      if (sortingIndex > -1) {
        sortings[sortingIndex].order = order;
      } else {
        sortings.push({
          uid: cuid(),
          parentId: recipeId,
          order
        });
      }
      return {
        ...state,
        sortings,
        additions: [...state.additions, addition],
        sessionCount: state.sessionCount + 1
      };
    }
    case 'CREATE_STEP': {
      const { itemId } = action.payload;
      const addition = {
        uid: cuid(),
        kind: 'Step',
        parentId: itemId,
        directions: ''
      };
      return {
        ...state,
        additions: [...state.additions, addition],
        sessionCount: state.sessionCount + 1
      };
    }
    case 'CREATE_INGREDIENT': {
      const { stepId } = action.payload;
      const addition = {
        uid: cuid(),
        kind: 'Ingredient',
        parentId: stepId,
        quantity: '',
        unit: '',
        name: '',
        processing: ''
      };
      return {
        ...state,
        additions: [...state.additions, addition],
        sessionCount: state.sessionCount + 1
      };
    }
    case 'SET_SORTING': {
      const { sourceI, destinationI, parentId, unsorted } = action.payload;
      const { sortings } = state;
      const sortingIndex = sortings.findIndex(
        sorting => sorting.parentId === parentId
      );
      const sortingExists = sortingIndex > -1;
      const sorted = getSorted(unsorted, sortings, parentId);
      const order = reorder(sorted, sourceI, destinationI).map(
        child => child.uid
      );

      if (
        sortingExists &&
        areArraysEqual(
          order,
          unsorted.map(child => child.uid)
        )
      ) {
        // Remove existing sorting if the new value is the same as the source
        sortings.splice(sortingIndex, 1);
      } else if (sortingExists) {
        // Update existing sorting
        sortings[sortingIndex].order = order;
      } else {
        // Add new sorting
        sortings.push({
          uid: cuid(),
          parentId,
          order
        });
      }

      return {
        ...state,
        sortings,
        sessionCount: state.sessionCount + 1
      };
    }
    default:
      throw new Error();
  }
};
