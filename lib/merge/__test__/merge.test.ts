import merge from "../src/merge"

describe("test merge", () => {
    it("test merge object", () => {
        const target: Record<string, any> = { a: { a: "1", b: 2 } }
        const merged = merge(target, { b: "b" })
        expect(target === merged).toBe(true)
        expect(target.b).toBe("b")
        const entries = Object.entries(target)
        expect(entries.length).toBe(2)
        entries.forEach(([key, value]) => {
            expect(["a", "b"].includes(key)).toBe(true)
            if (key === "a") {
                expect(value.a).toBe("1")
                expect(value.b).toBe(2)
            } else expect(value).toBe("b")
        })
    })
    it("test merge object with same key", () => {
        const target: Record<string, any> = { a: { a: "1", b: 2 }, b: 2 }
        const source = { a: { b: { b: 1, c: "2" }, d: "d" }, b: "b" }
        const merged = merge(target, source)
        expect(target === merged).toBe(true)
        expect(target.b).toBe("b")
        const entries = Object.entries(target)
        expect(entries.length).toBe(2)
        entries.forEach(([key, value]) => {
            expect(["a", "b"].includes(key)).toBe(true)
            if (key === "a") {
                expect(value.a).toBe("1")
                expect(value.d).toBe("d")
                expect(value.b === source.a.b).toBe(true)
            } else expect(value).toBe("b")
        })
    })
})