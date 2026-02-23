import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/tests'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/index.ts',
        '!src/config/**',
    ],
    coverageReporters: ['text', 'lcov'],
    verbose: true,
    // Give tests more time for MongoDB memory server to spin up
    testTimeout: 30000,
};

export default config;
