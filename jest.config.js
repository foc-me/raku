/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^package/(.*)$": "<rootDir>/package/$1",
    "^package/": "<rootDir>/package"
  }
};