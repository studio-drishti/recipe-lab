module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-localstorage-mock'],
  testPathIgnorePatterns: ['.next', 'node_modules'],
  moduleNameMapper: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};
