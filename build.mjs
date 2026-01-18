import esbuild from "esbuild";

const isProd = process.argv.includes("--prod");

await esbuild.build({
  entryPoints: ["prototype-3/src/ts/index.ts"],
  outfile: "dist/tmg-player.js",
  bundle: true,
  format: "iife", // <- single global file
  globalName: "tmg", // window.tmg
  sourcemap: !isProd,
  minify: isProd,
  target: ["es2020"],
  platform: "browser",
});

await esbuild.build({
  entryPoints: ["prototype-3/src/ts/index.ts"],
  outfile: "dist/tmg-player.mjs",
  bundle: true,
  format: "esm",
  sourcemap: true,
  target: ["es2020"],
});
