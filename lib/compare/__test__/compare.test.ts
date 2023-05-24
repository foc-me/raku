import compare, { CompareOperator } from "../src/compare"

describe("test compare function", () => {
    it("test number", () => {
        expect(compare(0, CompareOperator.lt, -0)).toBe(false)
        expect(compare(0, CompareOperator.lte, -0)).toBe(true)
        expect(compare(0, CompareOperator.eq, -0)).toBe(true)
        expect(compare(0, CompareOperator.gte, -0)).toBe(true)
        expect(compare(0, CompareOperator.gt, -0)).toBe(false)
        expect(compare(0, CompareOperator.sim, -0)).toBe(true)

        expect(compare(12, CompareOperator.lt, 10)).toBe(false)
        expect(compare(12, CompareOperator.lte, 10)).toBe(false)
        expect(compare(12, CompareOperator.eq, 10)).toBe(false)
        expect(compare(12, CompareOperator.gte, 10)).toBe(true)
        expect(compare(12, CompareOperator.gt, 10)).toBe(true)
        expect(compare(12, CompareOperator.sim, 10)).toBe(false)

        expect(compare(10, CompareOperator.lt, 12)).toBe(true)
        expect(compare(10, CompareOperator.lte, 12)).toBe(true)
        expect(compare(10, CompareOperator.eq, 12)).toBe(false)
        expect(compare(10, CompareOperator.gte, 12)).toBe(false)
        expect(compare(10, CompareOperator.gt, 12)).toBe(false)
        expect(compare(10, CompareOperator.sim, 12)).toBe(false)
    })
    it("test octal number", () => {
        expect(compare(0x22, CompareOperator.lt, 0o33)).toBe(false)
        expect(compare(0x22, CompareOperator.lte, 0o33)).toBe(false)
        expect(compare(0x22, CompareOperator.eq, 0o33)).toBe(false)
        expect(compare(0x22, CompareOperator.gte, 0o33)).toBe(true)
        expect(compare(0x22, CompareOperator.gt, 0o33)).toBe(true)
        expect(compare(0x22, CompareOperator.sim, 0o33)).toBe(false)

        expect(compare(0o33, CompareOperator.lt, 0x22)).toBe(true)
        expect(compare(0o33, CompareOperator.lte, 0x22)).toBe(true)
        expect(compare(0o33, CompareOperator.eq, 0x22)).toBe(false)
        expect(compare(0o33, CompareOperator.gte, 0x22)).toBe(false)
        expect(compare(0o33, CompareOperator.gt, 0x22)).toBe(false)
        expect(compare(0o33, CompareOperator.sim, 0x22)).toBe(false)
    })
})