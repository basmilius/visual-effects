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
            file: './dist/basmilius.effects.fireworks.js',
			format: "cjs",
			sourcemap: true
		},
		{
			compact: true,
            file: './dist/basmilius.effects.fireworks.es.js',
			format: "esm",
			sourcemap: true
		},
        {
            compact: true,
            file: './dist/basmilius.effects.fireworks.umd.js',
            format: "umd",
            name: "BMEffectsFireworks",
            sourcemap: true,
            globals: {
                "@basmilius/effects-common": "BMEffectsCommon"
            }
        }
	],
	external: [
        "@basmilius/effects-common"
    ],
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
