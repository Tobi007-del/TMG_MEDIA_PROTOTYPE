import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { execSync } from "child_process";

const isProd = process.env.NODE_ENV === "production" || process.argv.includes("--prod");
console.log(`Building in ${isProd ? "production" : "development"} mode...`);

const base = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: isProd,
  target: ["es2020"],
  platform: "browser",
  plugins: [sassPlugin()],
};

console.log("Generating IIFE build...");
await esbuild.build({
  ...base,
  outfile: "dist/tmg-player.js",
  format: "iife", // <- single global file
  globalName: "tmg", // window.tmg
  sourcemap: !isProd,
});
console.log("IIEFE build complete.");

console.log("Generating ESM build...");
await esbuild.build({
  ...base,
  outfile: "dist/tmg-player.mjs",
  format: "esm",
  sourcemap: !isProd,
});
console.log("ESM build complete.");

try {
  console.log("Generating types...");
  execSync("npx dts-bundle-generator -o dist/tmg-player.d.ts src/index.ts");
  console.log("Type generation complete.");
} catch (e) {
  console.error("Type generation failed.");
  process.exit(1);
} finally {
  console.log("Build generation complete!");
  console.log("\x1b[38;2;139;69;19mTMG Media Player\x1b[0m is ready to serve :)");
}
