import { createEmitter, useEmitter } from "../src/emitter";

const emitter = createEmitter()
const result = { current: 0 }

beforeEach(() => {
    const { clear } = useEmitter(emitter)
    clear()
    result.current = 0
})

describe("add a emit event", () => {
    it("add emit plus events", () => {
        const plusEvents = [
            () => { result.current += 1 },
            () => { result.current += 2 },
            () => { result.current += 3 }
        ]
        const { on, emit, clear } = useEmitter(emitter)
        on("plus", ...plusEvents)
        emit("plus")
        expect(result.current).toBe(6)
        emit("plus")
        expect(result.current).toBe(12)
        clear("plus")
        emit("plus")
        expect(result.current).toBe(12)
    })
    it("test emit event with parameters", () => {
        const plus = (num: number) => {
            result.current += num
        }
        const plusNumbers = (...nums: number[]) => {
            nums.forEach(num => {
                result.current += num
            })
        }
        const { on, emit, clear } = useEmitter(emitter)
        on("plus", plus)
        emit("plus", 12)
        expect(result.current).toBe(12)
        emit("plus", -4)
        expect(result.current).toBe(8)
        emit("plus", 12)
        expect(result.current).toBe(20)
        on("plus", plusNumbers)
        emit("plus", 1, 2, 3)
        expect(result.current).toBe(27)
        clear("plus")
        emit("plus", 1, 2, 3)
        expect(result.current).toBe(27)
    })
    it("test one event for some emits", () => {
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
        const { on, emit, clear } = useEmitter(emitter)
        on(["plus", "subtract"], event)
        emit("plus", { type: "plus", nums: [1, 2, 3] })
        expect(result.current).toBe(6)
        emit("plus")
        expect(result.current).toBe(6)
        emit("subtract", { type: "subtract", nums: [10] })
        expect(result.current).toBe(-4)
        clear("plus")
        emit("plus", { type: "plus", nums: [1, 2, 3] })
        expect(result.current).toBe(-4)
        emit("subtract", { type: "subtract", nums: [1, 2, 3] })
        expect(result.current).toBe(-10)
        on("plus", event)
        emit("plus", { type: "plus", nums: [4, 3, 2, 1] })
        expect(result.current).toBe(0)
        clear(event)
        emit("subtract", { type: "subtract", nums: [1, 2, 3] })
        expect(result.current).toBe(0)
        emit("plus", { type: "plus", nums: [4, 3, 2, 1] })
        expect(result.current).toBe(0)
    })
    it("test once", () => {
        const { once, emit } = useEmitter(emitter)
        const event = (...nums: number[]) => {
            nums.forEach(num => {
                result.current += num
            })
        }
        once("plus", event)
        emit("plus", 10, 9)
        expect(result.current).toBe(19)
        emit("plus", 10, 9)
        expect(result.current).toBe(19)
    })
})