const { watchRollup, copyFiles } = require("./base")

function runWatch() {
    watchRollup(copyFiles)
}

runWatch()