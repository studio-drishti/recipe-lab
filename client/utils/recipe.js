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
