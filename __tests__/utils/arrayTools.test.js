import { updateOrInsertInArray } from 'schooled-lunch/client/util/arrayTools';

describe('Update or insert an item in an array', () => {
  const arr = [
    {
      sourceId: 1234,
      value: 'Chicken'
    },
    {
      sourceId: 5678,
      value: 'Beef'
    }
  ];

  it('should replace the first object in the array', () => {
    expect(
      updateOrInsertInArray(
        arr,
        { sourceId: 1234, value: 'Shrimp' },
        'sourceId'
      )[0]
    ).toEqual({ sourceId: 1234, value: 'Shrimp' });
  });

  it('should add a new array item', () => {
    expect(
      updateOrInsertInArray(arr, { sourceId: 1111, value: 'Beans' }, 'sourceId')
        .length
    ).toEqual(3);
  });
});
