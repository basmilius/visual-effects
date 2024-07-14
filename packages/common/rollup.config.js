import cleanup from "rollup-plugin-cleanup";
import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "./src/index.ts",
	output: [
		{
			compact: true,
			file: './dist/basmilius.effects.common.js',
			format: "cjs",
			sourcemap: true
		},
		{
			compact: true,
            file: './dist/basmilius.effects.common.es.js',
			format: "esm",
			sourcemap: true
		},
		{
			compact: true,
            file: './dist/basmilius.effects.common.umd.js',
			format: "umd",
            name: "BMEffectsCommon",
			sourcemap: true
		}
	],
	external: [],
	plugins: [
		peerDepsExternal(),
		resolve(),
		commonjs(),
		typescript(),
        terser(),
        cleanup({
            comments: "none"
        })
	]
};
