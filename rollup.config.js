const typescript = require("@rollup/plugin-typescript")
const terser = require("@rollup/plugin-terser")

const compillerOption = {
    outDir: null,
    declaration: false,
    declarationDir: null
}

module.exports = {
    input: "./lib/index.ts",
    output: [
        { dir: "./dist/esm", format: "esm" },
        { dir: "./dist/dist", format: "umd", name: "raku" }
    ],
    plugins: [
        typescript(compillerOption),
        terser()
    ],
    watch: {
        include: ["lib/**"],
        exclude: [
            "lib/**/__test__/**",
            "lib/**/**_old.ts",
            "lib/**/**.old.ts"
        ],
        buildDelay: 400
    }
}