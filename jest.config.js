module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js', 'jest-localstorage-mock'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy'
  }
};
