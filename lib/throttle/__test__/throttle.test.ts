import throttle from "../src/throttle"

const number = { current: 0 }
const timer = { current: 0 }
const setTimer = () => {
    timer.current -= 1
}

beforeEach(() => {
    number.current = 0
    timer.current = 0
})

describe("test a throttle function", () => {
    it("test leading", async () => {
        const callback = throttle(() => {
            number.current += 1
        }, 100)
        timer.current = 10
        await new Promise((resolve) => {
            const action = () => {
                callback()
                setTimer()
                if (timer.current > 0) setTimeout(action, 10)
                else resolve(undefined)
            }
            action()
        }).then(() => {
            expect(number.current).toBeGreaterThanOrEqual(1)
            expect(number.current).toBeLessThanOrEqual(2)
        })

        timer.current = 20
        await new Promise((resolve) => {
            const action = () => {
                callback()
                setTimer()
                if (timer.current > 0) setTimeout(action, 10)
                else resolve(undefined)
            }
            action()
        }).then(() => {
            expect(number.current).toBeGreaterThanOrEqual(3)
            expect(number.current).toBeLessThanOrEqual(4)
        })
    })

    it("test leading with max", async () => {
        const callback = throttle(() => {
            number.current += 1
        }, 100, { max: 50 })
        timer.current = 10
        await new Promise((resolve) => {
            const action = () => {
                callback()
                setTimer()
                if (timer.current > 0) setTimeout(action, 10)
                else resolve(undefined)
            }
            action()
        }).then(() => {
            expect(number.current).toBeGreaterThanOrEqual(2)
            expect(number.current).toBeLessThanOrEqual(3)
        })

        timer.current = 20
        await new Promise((resolve) => {
            const action = () => {
                callback()
                setTimer()
                if (timer.current > 0) setTimeout(action, 10)
                else resolve(undefined)
            }
            action()
        }).then(() => {
            expect(number.current).toBeGreaterThanOrEqual(6)
            expect(number.current).toBeLessThanOrEqual(7)
        })
    })
})