/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,
  moduleNameMapper: {
    '^next-auth': require.resolve('next-auth'),
    '^@/(.*)$': '<rootDir>/$1',
    '^@auth/(.*)$': '<rootDir>/node_modules/@auth/$1',
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.ts',
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.ts`,
    // Handle @next/font
    '@next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.ts`,
    // Handle next/font
    'next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.ts`,
    // Disable server-only
    'server-only': `<rootDir>/__mocks__/empty.ts`,
    '^vscode-languageserver-types': require.resolve(
      'vscode-languageserver-types'
    ),
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.test.json' },
    ],
  },
  resetMocks: false,
  coverageProvider: 'v8',
  collectCoverageFrom: ['app/**', 'auth/**', 'components/**', 'lib/**'],
  coveragePathIgnorePatterns: [
    '/lib/store.ts',
    '/lib/hooks.ts',
    'types\\.ts$',
    'constants\\.ts$',
    'model\\.ts$',
    'interface\\.ts$',
    'schema\\.ts$',
    'config\\.ts$',
    'theme\\.ts$',
    'loading\\.tsx$',
    'layout\\.tsx$',
    './app/\\[lng\\]/requests-history/page.tsx',
    '/app/api/auth/\\[\\.\\.\\.nextauth\\]/route.ts',
  ],
};

export default createJestConfig(config);
