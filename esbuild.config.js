import * as esbuild from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { readFileSync } from 'fs';
import liveServer from "live-server";
import optimizeCSSAndHTMLPlugin from './plugins/optimize-css-html.js';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin'
import { createHash } from 'crypto';
import { cleanCssPlugin } from './plugins/clean-css.js';

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
        cleanCssPlugin(),
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

const createConfigs = (path) => [
    // Core ESM
    {
        ...sharedConfig,
        entryPoints: ['src/core/index.ts'],
        format: 'esm',
        outfile: `${path}/signa.core.esm.v${version}.js`,
        alias: {
            'VERSION': JSON.stringify(version),
        },
    },
    // Core IIFE
    {
        ...sharedConfig,
        entryPoints: ['src/core/index.ts'],
        format: 'iife',
        outfile: `${path}/signa.core.v${version}.js`,
        globalName: 'signa.core',
        alias: {
            'VERSION': JSON.stringify(version),
        },
    },
    // Components IIFE only
    {
        ...sharedConfig,
        entryPoints: ['src/components/index.ts'],
        format: 'iife',
        outfile: `${path}/signa.components.v${version}.js`,
        globalName: 'signa.components',
        alias: {
            'VERSION': JSON.stringify(version),
        },
        external: ['signa/core'],
    },
];

if (isDev) {
    const configs = createConfigs(examplesPath);
    const ctx = await Promise.all(
        configs.map(config =>
            esbuild.context({
                ...config,
                plugins: [
                    ...config.plugins,
                    useClean(examplesPath)
                ],
                sourcemap: false,
                minify: true,
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
    const configs = createConfigs(buildPath);
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