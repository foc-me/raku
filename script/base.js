const fs = require("fs")
const path = require("path")
const child = require("child_process")
const { rollup, watch } = require("rollup")
const { loadConfigFile } = require("rollup/loadConfigFile")
const package = require("../package.json")

const rollupOption = path.resolve(__dirname, '../rollup.config.js')

function runTsc() {
    return child.spawn("yarn", ["build:ts"], {
        shell: true
    })
}

async function copyFiles() {
    const dist = path.resolve(__dirname, "../dist")
    if (!fs.existsSync(dist)) fs.mkdirSync(dist)
    const readmePath = path.resolve(__dirname, "../readme.md")
    await fs.copyFileSync(readmePath, path.join(dist, "/readme.md"))

    const newPackage = JSON.stringify({
        name: package.name,
        version: package.version,
        description: package.description,
        private: false,
        repository: package.repository,
        author: package.author,
        license: package.license,
        main: "dist/index.js",
        module: "esm/index.js",
        files: ["dist", "lib", "esm", "type", "readme.md", "package.json"],
        types: "type/index.d.ts"
    })
    await fs.writeFileSync(path.join(dist, "/package.json"), newPackage)
}

function runRollup() {
    return loadConfigFile(rollupOption).then(async ({ options, warnings }) => {
        warnings.flush()
        for (const option of options) {
            const bundle = await rollup(option);
            await Promise.all(option.output.map(bundle.write))
            bundle.close()
        }
    })
}

async function watchRollup() {
    await copyFiles()
    const { options, warnings } = await loadConfigFile(rollupOption)
    warnings.flush()
    const watcher = watch(options)
    watcher.on("event", (event) => {
        const { code, duration, result } = event
        if (code === "START") console.log("building")
        if (code === "BUNDLE_END" && result) {
            console.log(`done in ${duration} ms`)
            result.close()
        }
        if (code === "END") {
            console.log("running tsc")
            const child = runTsc()
            child.on("exit", async (code) => {
                if (code === 2) {
                    console.log(error)
                }
                if (code === 0) {
                    console.log("done")
                }
            })
        }
    })
    watcher.on("change", (target) => {
        console.log("change =>", target)
    })
}

module.exports = {
    runTsc,
    runRollup,
    watchRollup,
    copyFiles
}