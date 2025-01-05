import * as esbuild from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { readFileSync } from 'fs';
import liveServer from "live-server";
import optimizeCSSAndHTMLPlugin from './plugins/optimize-css-html.js';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin'
import path from 'path';
import { createHash } from 'crypto';

const isDev = process.argv.includes('--dev');
const buildPath = 'dist';
const examplesPath = 'examples/dist';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = packageJson.version;


const useClean = (path) => clean({
    patterns: [`${path}/**/*`],
    cleanOnStartPatterns: ['./prepare'],
    cleanOnEndPatterns: ['./post'],
});

const sharedConfig = {
    bundle: true,
    target: ['es2019'],
    plugins: [
        sassPlugin({
            filter: /\.module\.scss$/,
            transform: postcssModules({
                generateScopedName: (name, filename) => {
                    const hash = createHash('md5')
                        .update(filename + name)
                        .digest('hex')
                        .slice(0, 5);
                    return `signa_${name}_${hash}`;
                }
            })
        }),
        optimizeCSSAndHTMLPlugin(),
    ],
    tsconfig: 'tsconfig.json',
};

const createConfig = (entryPoint, outputPath, globalName = null, external = []) => [
    {
        ...sharedConfig,
        entryPoints: [entryPoint],
        format: 'esm',
        outfile: `${outputPath}.esm.v${version}.js`,
        alias: {
            'VERSION': JSON.stringify(version),
        },
        external,
    },
    {
        ...sharedConfig,
        entryPoints: [entryPoint],
        format: 'iife',
        outfile: `${outputPath}.v${version}.js`,
        globalName,
        alias: {
            'VERSION': JSON.stringify(version),
        },
        external,
    },
];

const useConfigs = (path) => [
    ...createConfig('src/core/index.ts', `${path}/core`, 'Signa'),
    ...createConfig('src/components/index.ts', `${path}/components`, 'SignaCmp', ['signa/core']),
    ...createConfig('src/index.ts', `${path}/index`, 'Signa'),
];


if (isDev) {
    const configs = useConfigs(examplesPath)
    const ctx = await Promise.all(
        configs.map(config =>
            esbuild.context({
                ...config,
                plugins: [
                    ...config.plugins,
                    useClean(examplesPath)
                ],
                sourcemap: true,
                minify: false,
            })
        )
    );

    await Promise.all(ctx.map(c => c.watch()));

    liveServer.start({
        port: 3000,
        root: "examples",
        open: false,
        file: "index.html",
    });

    // Generate minified versions in dev
    await Promise.all(
        configs.map(config =>
            esbuild.build({
                ...config,
                minify: true,
                sourcemap: false,
            })
        )
    );
} else {
    const configs = useConfigs(buildPath)
    await Promise.all(
        configs.map(config =>
            esbuild.build({
                ...config,
                plugins: [
                    ...config.plugins,
                    useClean(buildPath)
                ],
                minify: true,
                sourcemap: false,
            })
        )
    );
} 
