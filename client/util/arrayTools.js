export const updateOrInsertInArray = ( arr, obj, prop1, prop2 = null) => {
  let index

  if(prop2) {
    index = arr.findIndex( item => obj[prop1] === item[prop1] && obj[prop2] === item[prop2])
  } else {
    index = arr.findIndex( item => obj[prop1] === item[prop1])
  }

  if(index > -1) {
    arr[index] = obj
  } else {
    arr.push(obj)
  }
  return arr
}
