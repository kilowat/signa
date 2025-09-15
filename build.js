import * as esbuild from 'esbuild'


await esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    format: "iife",
    globalName: "signa",
    outfile: "dist/signa.min.js",
    minify: true,
    sourcemap: false,
})

console.log("✅ Build success");