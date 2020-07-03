import React from 'react';
import { TIME_OPTIONS } from '../../constants';
import DiffText from '../components/DiffText';
import Tooltip from '../components/Tooltip';

export const getSorted = (unsorted, sortings, parentId) => {
  const sortMod = sortings.find((mod) => mod.parentId === parentId);

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
    (fieldName) =>
      (edits !== undefined && edits[fieldName]) ||
      source[fieldName] ||
      alterations.some(
        (mod) => mod.sourceId === source.uid && mod.field === fieldName
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
  if (!source) return '';
  const mod = alterations.find(
    (mod) => mod.sourceId === source.uid && mod.field === fieldName
  );
  return mod ? mod.value : source[fieldName];
};

export const maybeGetEnumValue = (fieldName, value) => {
  switch (fieldName) {
    case 'time':
      return TIME_OPTIONS[value];
    default:
      return value;
  }
};

export const isEnumField = (fieldName) => ['time'].includes(fieldName);

export const renderFieldWithMods = (
  fieldName,
  source,
  alterations,
  edits = {},
  errors = {},
  isRemoved = false
) => {
  const original = maybeGetEnumValue(fieldName, source[fieldName]);

  if (isRemoved) return <del>{original}</del>;

  const modified = maybeGetEnumValue(
    fieldName,
    getFieldValue(fieldName, source, alterations, edits)
  );

  if (!modified || original === modified) return original;

  const Diff = isEnumField(fieldName) ? (
    <>
      <del>{original}</del> <ins>{modified}</ins>
    </>
  ) : (
    <DiffText original={original} modified={modified} />
  );

  if (edits[fieldName] !== undefined && errors[fieldName]) {
    return <Tooltip tip={errors[fieldName]}>{Diff}</Tooltip>;
  }

  return Diff;
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
        items: additions
          .filter((addition) => addition.kind === 'Item')
          .map(({ kind, ...item }) => item),
        steps: additions
          .filter((addition) => addition.kind === 'Step')
          .map(({ kind, ...step }) => step),
        ingredients: additions
          .filter((addition) => addition.kind === 'Ingredient')
          .map(({ kind, ...ingredient }) => ingredient),
      };
    });
