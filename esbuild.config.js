import * as esbuild from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { readFileSync } from 'fs';
import liveServer from "live-server";
import optimizeCSSAndHTMLPlugin from './plugins/optimize-css-html.js';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';
import { createHash } from 'crypto';
import fsPath from 'path';

const isDev = process.argv.includes('--dev');
const examplesPath = 'examples/dist';

// Читаем версии из package.json каждого пакета
const coreVersion = JSON.parse(readFileSync('./packages/core/package.json', 'utf-8')).version;
const componentsVersion = JSON.parse(readFileSync('./packages/components/package.json', 'utf-8')).version;

const useClean = (path) => clean({
    patterns: [`${path}/**/*`],
    cleanOnStartPatterns: ['./prepare'],
    cleanOnEndPatterns: ['./post'],
});

// Плагин для обработки внешних зависимостей
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

const createConfigs = (outputPath) => [
    // Core ESM
    {
        ...sharedConfig,
        entryPoints: ['packages/core/src/index.ts'],
        format: 'esm',
        outfile: `packages/core/${outputPath}/signa.core.esm.js`,
        alias: {
            'VERSION': JSON.stringify(coreVersion),
        },
    },
    // Core IIFE
    {
        ...sharedConfig,
        entryPoints: ['packages/core/src/index.ts'],
        format: 'iife',
        platform: 'browser',
        outfile: `packages/core/${outputPath}/signa.core.js`,
        globalName: 'signa',
        alias: {
            'VERSION': JSON.stringify(coreVersion),
        },
    },
    // Components ESM
    {
        ...sharedConfig,
        entryPoints: ['packages/components/src/index.ts'],
        format: 'esm',
        outfile: `packages/components/${outputPath}/signa.components.esm.js`,
        external: ['@signa/core'],
        alias: {
            'VERSION': JSON.stringify(componentsVersion),
        },
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
        outfile: `packages/components/${outputPath}/signa.components.js`,
        globalName: 'signaComponents',
        external: ['@signa/core'],
        alias: {
            'VERSION': JSON.stringify(componentsVersion),
        },
    },
];

if (isDev) {
    const configs = createConfigs('dist');
    const ctx = await Promise.all(
        configs.map(config =>
            esbuild.context({
                ...config,
                plugins: [
                    ...config.plugins,
                    useClean(config.outfile.replace(/\/[^/]+$/, ''))
                ],
                sourcemap: true,
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
    const configs = createConfigs('dist');
    await Promise.all(
        configs.map(config =>
            esbuild.build({
                ...config,
                plugins: [
                    ...config.plugins,
                    useClean(config.outfile)
                ],
                minify: true,
                sourcemap: false,
            })
        )
    );
}