import React from 'react';
import DiffText from '../components/DiffText';
import Tooltip from '../components/Tooltip';

export const getSorted = (unsorted, sortings, parentId) => {
  const sortMod = sortings.find(mod => mod.parentId === parentId);

  if (sortMod === undefined) return unsorted;

  return [...unsorted].sort((a, b) => {
    const indexA = sortMod.order.indexOf(a.uid);
    const indexB = sortMod.order.indexOf(b.uid);
    if (indexB === -1) return 0;
    return indexA > indexB;
  });
};

/**
 * Check if a recipe object (item, step, ingredient) does not have anything entered
 * in any of its fields; in the source itself, alterations array, or optional edits object
 * @param {Array} fields array of field names to check
 * @param {Object} source the source object (item/step/ingredient)
 * @param {Array} alterations array of recipe alterations
 * @param {Object} edits optional edits object
 */
export const areAllFieldsEmpty = (fields, source, alterations, edits) =>
  !fields.some(
    fieldName =>
      (edits !== undefined && edits[fieldName]) ||
      source[fieldName] ||
      alterations.some(
        mod => mod.sourceId === source.uid && mod.field === fieldName
      )
  );

/**
 * Get the actual value of the field, preferring edits, then alterations over source material.
 * @param {String} fieldName name of field to get
 * @param {Object} source source object (recipe/item/step/ingredient)
 * @param {Array} alterations array or recipe alterations
 * @param {Object} edits optional edits object provided when field is being edited but has not been saved.
 */
export const getFieldValue = (fieldName, source, alterations, edits = {}) => {
  if (edits[fieldName] !== undefined) return edits[fieldName];
  const mod = alterations.find(
    mod => mod.sourceId === source.uid && mod.field === fieldName
  );
  return mod ? mod.value : source[fieldName];
};

export const renderFieldWithMods = (
  fieldName,
  source,
  alterations,
  isRemoved = false,
  edits = {},
  errors = {}
) => {
  const original = source[fieldName];

  if (isRemoved) return <del>{original}</del>;

  const modified = getFieldValue(fieldName, source, alterations, edits);

  if (edits[fieldName] !== undefined && errors[fieldName]) {
    return (
      <Tooltip tip={errors[fieldName]}>
        <DiffText original={original} modified={modified} />
      </Tooltip>
    );
  }

  if (original !== modified) {
    return <DiffText original={original} modified={modified} />;
  }

  return original;
};

export const getLocalStorageModifications = () =>
  Object.entries(localStorage)
    .filter(([key]) => key.startsWith('MOD'))
    .map(([key, value]) => {
      const { sortings, alterations, removals, additions } = JSON.parse(value);
      return {
        recipeId: key.replace('MOD-', ''),
        sortings,
        alterations,
        removals,
        items: additions.filter(addition => addition.kind === 'Item'),
        steps: additions.filter(addition => addition.kind === 'Step'),
        ingredients: additions.filter(
          addition => addition.kind === 'Ingredient'
        )
      };
    });
