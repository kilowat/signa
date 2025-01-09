import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';
import liveServer from "live-server";
import optimizeCSSAndHTMLPlugin from './plugins/optimize-css-html.js';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import { createHash } from 'crypto';

const isDev = process.argv.includes('--dev');
const isCore = process.argv.includes('--core');
const isComponents = process.argv.includes('--components');

const coreVersion = JSON.parse(readFileSync('./packages/core/package.json', 'utf-8')).version;
const componentsVersion = JSON.parse(readFileSync('./packages/components/package.json', 'utf-8')).version;

const externalGlobalsPlugin = {
    name: 'external-globals',
    setup(build) {
        build.onResolve({ filter: /^@signa\/core$/ }, args => ({
            path: args.path,
            namespace: 'external-globals',
        }));

        build.onLoad({ filter: /.*/, namespace: 'external-globals' }, () => ({
            contents: 'module.exports = signa;',
            loader: 'js',
        }));
    },
};

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
};

const createBuildConfigs = (outputPath, minify = false) => {
    const configs = [];
    const suffix = minify ? '.min' : '';

    // Core configs
    if (!isComponents) {
        configs.push(
            // Core ESM
            {
                ...sharedConfig,
                entryPoints: ['packages/core/src/index.ts'],
                format: 'esm',
                outfile: `packages/core/${outputPath}/signa.core.esm${suffix}.js`,
                alias: { 'VERSION': JSON.stringify(coreVersion) },
            },
            // Core IIFE
            {
                ...sharedConfig,
                entryPoints: ['packages/core/src/index.ts'],
                format: 'iife',
                bundle: true,
                platform: 'browser',
                outfile: `packages/core/${outputPath}/signa.core${suffix}.js`,
                globalName: 'signa',
                alias: { 'VERSION': JSON.stringify(coreVersion) },
            }
        );
    }

    // Components configs
    if (!isCore) {
        configs.push(
            // Components ESM
            {
                ...sharedConfig,
                entryPoints: ['packages/components/src/index.ts'],
                format: 'esm',
                outfile: `packages/components/${outputPath}/signa.components.esm${suffix}.js`,
                external: ['@signa/core'],
                alias: { 'VERSION': JSON.stringify(componentsVersion) },
            },
            // Components IIFE
            {
                ...sharedConfig,
                entryPoints: ['packages/components/src/index.ts'],
                plugins: [
                    ...sharedConfig.plugins,
                    externalGlobalsPlugin,
                ],
                format: 'iife',
                platform: 'browser',
                bundle: true,
                outfile: `packages/components/${outputPath}/signa.components${suffix}.js`,
                globalName: 'signaComponents',
                external: ['@signa/core'],
                alias: { 'VERSION': JSON.stringify(componentsVersion) },
            }
        );
    }

    return configs;
};

const build = async () => {
    if (isDev) {
        const configs = createBuildConfigs('dist', false);
        const ctx = await Promise.all(
            configs.map(config =>
                esbuild.context({
                    ...config,
                    plugins: [
                        ...config.plugins,
                    ],
                    sourcemap: false,
                    minify: false,
                })
            )
        );

        await Promise.all(ctx.map(c => c.watch()));

        liveServer.start({
            port: 3000,
            root: ".",
            open: false,
            file: "examples/index.html",
        });
    } else {
        // Build non-minified version
        const configs = createBuildConfigs('dist', false);
        await Promise.all(
            configs.map(config =>
                esbuild.build({
                    ...config,
                    plugins: [
                        ...config.plugins,
                    ],
                    sourcemap: false,
                    minify: false,
                })
            )
        );

        // Build minified version
        const minConfigs = createBuildConfigs('dist', true);
        await Promise.all(
            minConfigs.map(config =>
                esbuild.build({
                    ...config,
                    sourcemap: false,
                    minify: true,
                })
            )
        );
    }
};

build().catch((e) => {
    console.error(e);
    process.exit(1);
});