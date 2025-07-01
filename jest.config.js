/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!<rootDir>/src/**/*.stories.*'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 0.8,
      functions: 0.8,
      lines: 0.8,
      statements: 0.8,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
