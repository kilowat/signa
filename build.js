import * as esbuild from 'esbuild'
import fs from "fs"

await esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    format: "iife",
    globalName: "",
    outfile: "dist/signa.min.js",
    minify: true,
    sourcemap: false,
})
fs.copyFileSync("src/signa.d.ts", "dist/signa.d.ts");
console.log("✅ Build success");