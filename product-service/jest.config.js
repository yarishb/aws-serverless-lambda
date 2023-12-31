module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleNameMapper: {
    "^@functions/(.*)$": ["<rootDir>/src/functions/$1"],
    "^@libs/(.*)$": ["<rootDir>/src/libs/$1"],
    "^@interfaces/(.*)$": ["<rootDir>/src/interfaces/$1"],
    "^@db/(.*)$": ["<rootDir>/src/db/$1"],
  }
};
