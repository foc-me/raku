import createController, { EventType } from "../src/createController";

const result = { current: 0 }
const callbacks = [
    () => { result.current += 1 },
    () => { result.current += 2 },
    () => { result.current += 3 }
]
const controller = createController()

beforeEach(() => {
    controller.clear()
    result.current = 0
})

describe("controller", () => {
    it("add a event", () => {
        expect(controller.size()).toBe(0)
        const callback = callbacks[0]
        controller.add(callback)
        expect(controller.size()).toBe(1)
        expect(controller.has(callback)).toBe(true)
        controller.call()
        expect(result.current).toBe(1)
        expect(controller.remove(callback)).toBe(true)
        expect(controller.size()).toBe(0)
        expect(controller.has(callback)).toBe(false)
    })
    it("add all events", () => {
        expect(controller.size()).toBe(0)
        callbacks.forEach(callback => {
            controller.add(callback)
        })
        expect(controller.size()).toBe(callbacks.length)
        callbacks.forEach(callback => {
            expect(controller.has(callback)).toBe(true)
        })
        controller.call()
        expect(result.current).toBe(6)
        callbacks.forEach(callback => {
            expect(controller.remove(callback)).toBe(true)
        })
        expect(controller.size()).toBe(0)
        callbacks.forEach(callback => {
            expect(controller.has(callback)).toBe(false)
        })
    })
    it("add all events while the first event type is once", () => {
        expect(controller.size()).toBe(0)
        callbacks.forEach((callback, index) => {
            if (index === 0) controller.add(callback, { type: EventType.once })
            else controller.add(callback)
        })
        expect(controller.size()).toBe(callbacks.length)
        callbacks.forEach(callback => {
            expect(controller.has(callback)).toBe(true)
        })
        controller.call()
        expect(controller.size()).toBe(callbacks.length - 1)
        expect(result.current).toBe(6)
        callbacks.forEach((callback, index) => {
            if (index === 0) expect(controller.has(callback)).toBe(false)
            else expect(controller.has(callback)).toBe(true)
        })
    })
})