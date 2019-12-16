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
