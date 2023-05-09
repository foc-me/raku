export enum CompareOperator {
    lt = 1,
    lte = 2,
    eq = 3,
    gte = 4,
    gt = 5
}

function compare(current: any, operator: CompareOperator, target: any) {
    switch (operator) {
        case CompareOperator.lt: return current < target
        case CompareOperator.lte: return current <= target
        case CompareOperator.eq: return current === target
        case CompareOperator.gte: return current >= target
        case CompareOperator.gt: return current > target
        default: return false
    }
}

type CompareFunction = (current: any, target: any) => boolean

const lt: CompareFunction = (current, target) => {
    return compare(current, CompareOperator.lt, target)
}

const lte: CompareFunction = (current, target) => {
    return compare(current, CompareOperator.lte, target)
}

const eq: CompareFunction = (current, target) => {
    return compare(current, CompareOperator.eq, target)
}

const gte: CompareFunction = (current, target) => {
    return compare(current, CompareOperator.gte, target)
}

const gt: CompareFunction = (current, target) => {
    return compare(current, CompareOperator.gt, target)
}

compare.lt = lt
compare.lte = lte
compare.eq = eq
compare.gte = gte
compare.gt = gt

export default compare