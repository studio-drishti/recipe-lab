import { updateOrInsertInArray } from 'schooled-lunch/client/util/arrayTools';

describe('Update or insert an item in an array', () => {
  const arr = [
    {
      itemId: 1234,
      value: 'Chicken'
    },
    {
      itemId: 5678,
      value: 'Beef'
    }
  ];

  it('should replace the first object in the array', () => {
    expect(
      updateOrInsertInArray(arr, { itemId: 1234, value: 'Shrimp' }, 'itemId')[0]
    ).toEqual({ itemId: 1234, value: 'Shrimp' });
  });

  it('should add a new array item', () => {
    expect(
      updateOrInsertInArray(arr, { itemId: 1111, value: 'Beans' }, 'itemId')
        .length
    ).toEqual(3);
  });
});
