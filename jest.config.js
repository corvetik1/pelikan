/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  // Limit number of workers to avoid excessive memory usage in CI/Windows
  maxWorkers: process.env.CI ? 2 : '50%',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/**/*.stories.*',
    // Exclude infrastructure / generated helpers from coverage
    '!<rootDir>/src/lib/**',
    '!<rootDir>/src/redux/api.ts',
  ],
  coverageDirectory: 'coverage',
}


module.exports = createJestConfig(customJestConfig)
