import compare, { CompareOperator } from "lib/compare/src/compare"
import createCurrent from "lib/createCurrent/src/createCurrent"

function createCompare(initial: any) {
    const [origin, setOrigin] = createCurrent(initial)
    const update = (next: any) => { setOrigin(next) }
    const makeCompare = (operator: CompareOperator) => {
        return (current: any) => compare(current, operator, origin.current)
    }
    const lt = makeCompare(CompareOperator.lt)
    const lte = makeCompare(CompareOperator.lt)
    const eq = makeCompare(CompareOperator.lt)
    const gte = makeCompare(CompareOperator.lt)
    const gt = makeCompare(CompareOperator.lt)

    return { update, lt, lte, eq, gte, gt }
}

export default createCompare