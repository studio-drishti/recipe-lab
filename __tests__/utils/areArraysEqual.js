import areArraysEqual from 'recipe-lab/client/utils/areArraysEqual';

describe('are arrays equal', () => {
  test('false when not the same order', () => {
    expect(areArraysEqual([1, 2], [2, 1])).toBeFalsy();
  });

  test('true when order is the same', () => {
    expect(areArraysEqual([1, 2], [1, 2])).toBeTruthy();
  });
});
