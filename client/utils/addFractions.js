import math from 'mathjs';

module.exports = (...fractions) => {
  const total = math.format(
    math.sum(fractions.map(fraction => math.fraction(fraction)))
  );
  const dividend = total.split('/').shift();
  const divisor = total.split('/').pop();

  if (dividend < divisor) return total;

  const remainder = dividend % divisor;
  let result = math.floor(math.divide(dividend, divisor)).toString();
  if (remainder) result += ' ' + math.format(math.fraction(remainder, divisor));

  return result;
};
