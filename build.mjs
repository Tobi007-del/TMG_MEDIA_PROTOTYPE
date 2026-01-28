import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const isProd = process.argv.includes("--prod");

await esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/tmg-player.js",
  bundle: true,
  format: "iife", // <- single global file
  globalName: "tmg", // window.tmg
  sourcemap: !isProd,
  minify: isProd,
  target: ["es2020"],
  platform: "browser",
  plugins: [sassPlugin()],
  minify: isProd,
});

await esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/tmg-player.mjs",
  bundle: true,
  format: "esm",
  sourcemap: true,
  target: ["es2020"],
  plugins: [sassPlugin()],
  minify: isProd,
});
