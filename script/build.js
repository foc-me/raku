const fs = require("fs")
const path = require("path")
const child = require("child_process")
const { rollup } = require("rollup")
const rollupOption = require("../rollup.config")
const package = require(path.resolve(__dirname, "../package.json"))

function runTsc() {
    console.log("run tsc")
    return child.spawn("yarn", ["build:ts"], {
        shell: true
    })
}

async function runRollup() {
    const { input, output, plugins } = rollupOption
    const bundle = await rollup({ input, plugins })
    if (bundle) {
        try {
            for (const item of output) {
                await bundle.write(item)
            }
            await bundle.close();
        } catch (e) {
            process.exit(1, e)
        }
    }
}


async function copyFiles() {
    const dist = path.resolve(__dirname, "../dist")
    const readmePath = path.resolve(__dirname, "../readme.md")
    await fs.copyFileSync(readmePath, path.join(dist, "/readme.md"))

    const newPackage = JSON.stringify({
        name: package.name,
        version: package.version,
        description: package.description,
        private: package.private,
        homepage: package.homepage,
        bugs: package.bugs,
        author: package.author,
        license: package.license,
        main: "dist/index.js",
        module: "lib/index.js",
        files: ["dist", "lib", "package", "type", "readme.md", "package.json"],
        types: "type/index.d.ts"
    })
    await fs.writeFileSync(path.join(dist, "/package.json"), newPackage)
  }

const error = `
error with run tsc.
try "yarn build:ts" or the local tsc
and check the results
`

function runBuild() {
    const current = Date.now()
    const child = runTsc()
    child.on("exit", async (code) => {
        if (code === 2) {
            console.log(error)
            process.exit(code)
        }
        if (code === 0) {
            console.log("run rollup")
            await runRollup()
            console.log("copy files")
            await copyFiles()
            console.log(`ok in ${(Date.now() - current) / 1000} seconds`)
            process.exit(0)
        }
    })
}

runBuild()