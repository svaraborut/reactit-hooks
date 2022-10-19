import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    verbose: true,
    clearMocks: true,
    testEnvironment: 'jsdom',
    // transform: {
    //   [`^.+\\.tsx?$`]: `ts-jest`,
    // },
}

export default config
