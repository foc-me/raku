const typescript = require("@rollup/plugin-typescript")
const { uglify } = require("rollup-plugin-uglify")

const compillerOption = {
    outDir: null,
    declaration: false,
    declarationDir: null
}

module.exports = {
    input: "./package/index.ts",
    output: [
        { dir: "./dist/lib", format: "esm" },
        { dir: "./dist/dist", format: "umd", name: "raku" }
    ],
    plugins: [
        typescript(compillerOption),
        uglify()
    ]
}