import * as esbuild from 'esbuild';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { clean } from 'esbuild-plugin-clean';
import { readFileSync } from 'fs';
import liveServer from "live-server";
import optimizeCSSAndHTMLPlugin from './plugins/optimize-css-html.js';

const isDev = process.argv.includes('--dev');
const buildPath = 'dist';
const examplesPath = 'examples/dist';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = packageJson.version;

const sharedConfig = {
    bundle: true,
    target: ['es2019'],
    plugins: [
        vanillaExtractPlugin(),
        optimizeCSSAndHTMLPlugin(),
        clean({
            patterns: [`${buildPath}/**/*`],
            cleanOnStartPatterns: ['./prepare'],
            cleanOnEndPatterns: ['./post'],
        }),
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
                minify: true,
                sourcemap: false,
            })
        )
    );
} 
