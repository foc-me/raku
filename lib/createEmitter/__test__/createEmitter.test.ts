import createEmitter from "../src/createEmitter";

const result = { current: 0 }
const emitter = createEmitter()

beforeEach(() => {
    emitter.clear()
    result.current = 0
})

describe("add a emit event", () => {
    it("add emit plus events", async () => {
        const plusEvents = [
            () => { result.current += 1 },
            () => { result.current += 2 },
            () => { result.current += 3 }
        ]
        plusEvents.forEach(event => { emitter.on("plus", event) })
        await emitter.emit("plus")
        expect(result.current).toBe(6)
        await emitter.emit("plus")
        expect(result.current).toBe(12)
        await emitter.clear("plus")
        await emitter.emit("plus")
        expect(result.current).toBe(12)
    })
    it("test emit event with parameters", async () => {
        const plus = (num: number) => {
            result.current += num
        }
        const plusNumbers = (...nums: number[]) => {
            nums.forEach(num => {
                result.current += num
            })
        }
        emitter.on("plus", plus)
        await emitter.emit("plus", 12)
        expect(result.current).toBe(12)
        await emitter.emit("plus", -4)
        expect(result.current).toBe(8)
        await emitter.emit("plus", 12)
        expect(result.current).toBe(20)
        emitter.on("plus", plusNumbers)
        await emitter.emit("plus", 1, 2, 3)
        expect(result.current).toBe(27)
        emitter.clear("plus")
        await emitter.emit("plus", 1, 2, 3)
        expect(result.current).toBe(27)
    })
    it("test one event for some emits", async () => {
        const event = (param?: { type: string, nums: number[] }) => {
            const { type, nums = [] } = param || {}
            switch (type) {
                case "subtract":
                    nums.forEach(num => result.current -= num)
                    break
                default:
                    nums.forEach(num => result.current += num)
                    break
            }
        }
        ["plus", "subtract"].forEach(type => { emitter.on(type, event) })
        
        await emitter.emit("plus", { type: "plus", nums: [1, 2, 3] })
        expect(result.current).toBe(6)
        await emitter.emit("plus")
        expect(result.current).toBe(6)
        await emitter.emit("subtract", { type: "subtract", nums: [10] })
        expect(result.current).toBe(-4)
        emitter.clear("plus")
        await emitter.emit("plus", { type: "plus", nums: [1, 2, 3] })
        expect(result.current).toBe(-4)
        await emitter.emit("subtract", { type: "subtract", nums: [1, 2, 3] })
        expect(result.current).toBe(-10)
        emitter.on("plus", event)
        await emitter.emit("plus", { type: "plus", nums: [4, 3, 2, 1] })
        expect(result.current).toBe(0)
        emitter.clear(event)
        await emitter.emit("subtract", { type: "subtract", nums: [1, 2, 3] })
        expect(result.current).toBe(0)
        await emitter.emit("plus", { type: "plus", nums: [4, 3, 2, 1] })
        expect(result.current).toBe(0)
    })
})