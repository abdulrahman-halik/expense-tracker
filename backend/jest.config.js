/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/*.test.[jt]s'],
    testTimeout: 30000,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
