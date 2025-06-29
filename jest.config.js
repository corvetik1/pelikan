/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!<rootDir>/src/**/*.stories.*'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 0.3,
      functions: 0.3,
      lines: 0.3,
      statements: 0.3,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
