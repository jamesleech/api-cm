module.exports = {
  setupFiles: ['./tests/setup/setEnvironment.js'],
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  preset: '@shelf/jest-dynamodb',
  moduleNameMapper: {
    // Jest needs to know about module aliasing as it doesn't run after webpack magic
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@clients/(.*)$': '<rootDir>/src/clients/$1',
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@mappers/(.*)$': '<rootDir>/src/mappers/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@queries/(.*)$': '<rootDir>/src/queries/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
};
