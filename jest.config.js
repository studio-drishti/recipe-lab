module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-localstorage-mock'],
  testPathIgnorePatterns: ['.next', 'node_modules'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};
