const fs = require("fs")
const path = require("path")
const child = require("child_process")
const { rollup, watch } = require("rollup")
const { loadConfigFile } = require("rollup/loadConfigFile")
const rollupOption = require("../rollup.config")
const package = require("../package.json")

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
            await bundle.close()
        } catch (e) {
            process.exit(1, e)
        }
    }
}

function watchRollup(callback) {
    loadConfigFile(path.resolve(__dirname, '../rollup.config.js'), {
        format: 'es'
    }).then(async ({ options, warnings }) => {
        console.log(`We currently have ${warnings.count} warnings`)
        warnings.flush()
        for (const optionsObj of options) {
            const bundle = await rollup(optionsObj)
            await Promise.all(optionsObj.output.map(bundle.write))
        }
        const watcher = watch(options)
        watcher.on("event", (event) => {
            const { code, result } = event
            if (code === "END" && typeof callback === "function") {
                callback()
            }
            if (result) {
                result.close()
            }
        })
    })
}

async function copyFiles() {
    const dist = path.resolve(__dirname, "../dist")
    const readmePath = path.resolve(__dirname, "../readme.md")
    await fs.copyFileSync(readmePath, path.join(dist, "/readme.md"))

    const newPackage = JSON.stringify({
        name: package.name,
        version: package.version,
        description: package.description,
        private: false,
        homepage: package.homepage,
        bugs: package.bugs,
        author: package.author,
        license: package.license,
        main: "dist/index.js",
        module: "esm/index.js",
        files: ["dist", "lib", "esm", "type", "readme.md", "package.json"],
        types: "type/index.d.ts"
    })
    await fs.writeFileSync(path.join(dist, "/package.json"), newPackage)
}

module.exports = {
    runTsc,
    runRollup,
    watchRollup,
    copyFiles
}