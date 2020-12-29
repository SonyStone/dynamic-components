import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
  '^.+\\.(ts|js|html)$': 'ts-jest'
  },
  preset: 'jest-preset-angular',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
};

export default config;
