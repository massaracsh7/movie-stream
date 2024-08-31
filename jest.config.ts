import type { Config } from 'jest';

const config: Config = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  clearMocks: true,
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // убрано './' для согласованности
    '!src/**/*.d.ts', // исправлено для игнорирования всех деклараций типов
    '!node_modules/',
    '!<rootDir>/coverage/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta', // исправлено для указания модуля
              options: { metaObjectReplacement: { env: { VITE_CTP_PROJECT_KEY: 'MyProject', VITE_CTP_CLIENT_ID: 'MyClient', VITE_CTP_CLIENT_SECRET: 'MyClientSecret' } } }
            }
          ]
        },
        useESM: true,
      }
    ],
  },
};

export default config;
