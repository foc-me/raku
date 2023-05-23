
const { runTsc, runRollup, copyFiles } = require("./base")

const error = `
error with run tsc.
try "yarn build:ts" or the local tsc
and check the results
`

function runBuild() {
    const current = Date.now()
    console.log("run tsc")
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