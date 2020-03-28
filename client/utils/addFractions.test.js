import addFractions from './addFractions';

describe('are arrays equal', () => {
  test('2 whole numbers results in a whole number', () => {
    expect(addFractions(2, 3)).toEqual('5');
  });

  test('2 fractions result in a fraction', () => {
    expect(addFractions('1/3', '1/3')).toEqual('2/3');
  });

  test('2 fractions result in a whole number and a fraction', () => {
    expect(addFractions('2/3', '2/3')).toEqual('1 1/3');
  });

  test('a whole number with a fraction', () => {
    expect(addFractions('1 1/3', '1/3')).toEqual('1 2/3');
  });
});
