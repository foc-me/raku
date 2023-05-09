import classname from "../src/classname"

describe("test classNames", () => {
    it("test multiple arguments", () => {
        const classes = ["class-one", "class-tow", "class-three"]
        expect(classname(...classes)).toBe("class-one class-tow class-three")
    })
    it("test class object", () => {
        const classes = {
            "class-one": true,
            "class-two": false,
            "class-three": () => true
        }
        expect(classname(classes)).toBe("class-one class-three")
    })
    it("test class function", () => {
        const classes = () => "class-one"
        expect(classname(classes)).toBe("class-one")
    })
    it("test class array list", () => {
        const classes: Array<string | object | (() => void)> = ["class-one", "class-tow", "class-three"]
        expect(classname(classes)).toBe("class-one class-tow class-three")
        classes.push(() => "class-four")
        expect(classname(classes)).toBe("class-one class-tow class-three class-four")
        classes.push({ "class-five": () => "class-four", "class-six": () => 0 })
        expect(classname(classes)).toBe("class-one class-tow class-three class-four class-five")
    })
})