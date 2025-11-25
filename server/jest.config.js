module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            isolatedModules: false,
        }],
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
    ],
    setupFiles: ['<rootDir>/src/setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};