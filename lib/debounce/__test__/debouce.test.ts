import debounce from "../src/debounce"

const number = { current: 0 }
const timer = { current: 0 }
const setTimer = () => {
    timer.current -= 1
}
async function wait(delay: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), delay)
    })
}

beforeEach(() => {
    number.current = 0
    timer.current = 0
})

describe("test a throttle function", () => {
    it("test trailing", async () => {
    //     const callback = debounce(() => {
    //         number.current += 1
    //     }, 100)
    //     timer.current = 11
    //     await new Promise((resolve) => {
    //         const action = () => {
    //             callback()
    //             setTimer()
    //             if (timer.current > 0) setTimeout(action, 10)
    //             else {
    //                 callback.clear()
    //                 resolve(undefined)
    //             }
    //         }
    //         action()
    //     }).then(async () => {
    //         await wait(110)
    //         expect(number.current).toBeGreaterThanOrEqual(0)
    //         expect(number.current).toBeLessThanOrEqual(1)
    //     })

    //     timer.current = 21
    //     await new Promise((resolve => {
    //         const action = () => {
    //             callback()
    //             setTimer()
    //             if (timer.current > 0) setTimeout(action, 10)
    //             else resolve(undefined)
    //         }
    //         action()
    //     })).then(async () => {
    //         await wait(110)
    //         expect(number.current).toBeGreaterThanOrEqual(1)
    //         expect(number.current).toBeLessThanOrEqual(2)
    //     })
    })
    
    it("test trailing with max", async () => {
        // const callback = debounce(() => {
        //     number.current += 1
        // }, 100, { max: 50 })
        // timer.current = 11
        // await new Promise(async (resolve) => {
        //     const action = async () => {
        //         callback()
        //         setTimer()
        //         if (timer.current > 0) {
        //             if (timer.current % 5 === 0) await wait(110)
        //             setTimeout(action, 10)
        //         } else resolve(undefined)
        //         console.log(number.current)
        //     }
        //     await action()
        // }).then(async () => {
        //     await wait(110)
        //     expect(number.current).toBeGreaterThanOrEqual(1)
        //     expect(number.current).toBeLessThanOrEqual(2)
        // })

        // timer.current = 21
        // await new Promise(async (resolve) => {
        //     const action = async () => {
        //         callback()
        //         setTimer()
        //         if (timer.current > 0) {
        //             if (timer.current % 5 === 0) await wait(110)
        //             setTimeout(action, 10)
        //         } else resolve(undefined)
        //     }
        //     await action()
        // }).then(async () => {
        //     await wait(110)
        //     expect(number.current).toBeGreaterThanOrEqual(5)
        //     expect(number.current).toBeLessThanOrEqual(6)
        // })
    })
})