import { format, fraction, floor, divide, sum } from 'mathjs';

export const addFractions = (...fractions) => {
  const total = format(sum(fractions.map((fract) => fraction(fract))));
  const dividend = total.split('/').shift();
  const divisor = total.split('/').pop();

  if (dividend < divisor) return total;

  const remainder = dividend % divisor;
  let result = floor(divide(dividend, divisor)).toString();
  if (remainder) result += ' ' + format(fraction(remainder, divisor));

  return result;
};
