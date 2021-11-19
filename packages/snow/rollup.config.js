import {default as commonjs} from "@rollup/plugin-commonjs";
import {default as resolve} from "@rollup/plugin-node-resolve";
import {default as typescript} from "@rollup/plugin-typescript";
import {default as peerDepsExternal} from "rollup-plugin-peer-deps-external";
import {terser} from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";

import packageJson from "./package.json";

export default {
	input: "./src/index.ts",
	output: [
		{
			compact: true,
			file: packageJson.main,
			format: "cjs",
			sourcemap: true
		},
		{
			compact: true,
			file: packageJson.module,
			format: "esm",
			sourcemap: true
		},
        {
            compact: true,
            file: packageJson.umd,
            format: "umd",
            name: "BMEffectsSnow",
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
