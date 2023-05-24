const typescript = require("@rollup/plugin-typescript")
const { uglify } = require("rollup-plugin-uglify")

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
        uglify()
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