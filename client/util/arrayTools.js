export const updateOrInsertInArray = (arr, obj, prop1, prop2) => {
  const index = arr.findIndex(
    item =>
      obj[prop1] === item[prop1] &&
      (prop2 === undefined || obj[prop2] === item[prop2])
  );

  if (index > -1) {
    arr[index] = obj;
  } else {
    arr.push(obj);
  }
  return arr;
};
