import * as esbuild from 'esbuild';
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { clean } from 'esbuild-plugin-clean';
import { readFileSync } from 'fs';

const isDev = process.argv.includes('--dev');
const buildPath = 'dist';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = packageJson.version;

const sharedConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    target: ['es2019'],
    plugins: [
        vanillaExtractPlugin(),
        clean({
            patterns: [`${buildPath}/**/*`],
            cleanOnStartPatterns: ['./prepare'],
            cleanOnEndPatterns: ['./post'],
        }),
    ],
    tsconfig: 'tsconfig.json',
};

const configs = [
    {
        ...sharedConfig,
        format: 'esm',
        outfile: `dist/index.esm.v${version}.js`,
        alias: {
            'VERSION': JSON.stringify(version)
        }
    },
    {
        ...sharedConfig,
        format: 'iife',
        outfile: `dist/index.v${version}.js`,
        globalName: 'Signa',
        external: [],
        alias: {
            'VERSION': JSON.stringify(version)
        }
    }
];


if (isDev) {
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

    const liveServer = require('live-server');
    liveServer.start({
        port: 3000,
        root: "examples",
        open: false,
        file: "index.html"
    });
} else {
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