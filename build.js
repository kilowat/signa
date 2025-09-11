import * as esbuild from 'esbuild'
import { copyFileSync } from "fs";

await esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    format: "iife",
    globalName: "signa",
    outfile: "dist/signa.min.js",
    minify: true,
    sourcemap: false,
})
copyFileSync("src/signa.d.ts", "dist/signa.d.ts");

console.log("✅ Build success");