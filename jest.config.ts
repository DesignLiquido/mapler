import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        modulePathIgnorePatterns: ['<rootDir>/dist/'],
        testEnvironment: 'node',
        transform: {
            '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
        },
        coverageReporters: ['json-summary', 'lcov', 'text', 'text-summary'],
        moduleNameMapper: {
            // Se for utilizar módulos linkados, comentar as linhas abaixo:
            '@designliquido/delegua/(.*)': '<rootDir>/node_modules/@designliquido/delegua/$1'
            // E descomentar as linhas abaixo:
            // '@designliquido/delegua/(.*)': '<rootDir>/node_modules/@designliquido/delegua/fontes/$1'
        },
    };
};
