import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'
import fs from 'fs'

const pkgJson = fs.readFileSync('./package.json', 'utf-8')
const pkg = JSON.parse(pkgJson)

// todo : is this bundle TreeShakeable ?
// https://github.com/jaebradley/example-rollup-library/blob/master/rollup.config.js
export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'esm',
            },
        ],
        external: [...Object.keys(pkg.peerDependencies || {})],
        plugins: [
            nodeResolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
        ],
    },
    // compact the types
    {
        input: 'dist/types/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts()],
    },
]
