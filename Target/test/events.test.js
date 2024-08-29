"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../lib/utils");
describe("EventDispatcher", () => {
    it("Works in simple cases", () => {
        const emitter = new utils_1.EventDispatcher();
        let calls = 0;
        emitter.on("a", () => {
            calls++;
        });
        (0, assert_1.deepStrictEqual)(calls, 0);
        emitter.trigger("a");
        (0, assert_1.deepStrictEqual)(calls, 1);
        emitter.trigger("a");
        (0, assert_1.deepStrictEqual)(calls, 2);
    });
    it("Allows removing listeners", () => {
        const emitter = new utils_1.EventDispatcher();
        let calls = 0;
        const listener = () => {
            calls++;
        };
        emitter.off("a", listener);
        (0, assert_1.deepStrictEqual)(calls, 0);
        emitter.trigger("a");
        (0, assert_1.deepStrictEqual)(calls, 0);
    });
    it("Works correctly with missing listeners", () => {
        const emitter = new utils_1.EventDispatcher();
        let calls = 0;
        const listener = () => {
            calls++;
        };
        emitter.on("a", () => {
            calls++;
        });
        emitter.off("a", listener);
        emitter.trigger("a");
        (0, assert_1.deepStrictEqual)(calls, 1);
    });
    it("Works if a listener is removed while emitting", () => {
        const emitter = new utils_1.EventDispatcher();
        let calls = 0;
        emitter.on("a", function rem() {
            calls++;
            emitter.off("a", rem);
        });
        emitter.on("a", () => {
            calls++;
        });
        (0, assert_1.deepStrictEqual)(calls, 0);
        emitter.trigger("a");
        (0, assert_1.deepStrictEqual)(calls, 2);
        emitter.trigger("a");
        (0, assert_1.deepStrictEqual)(calls, 3);
    });
    it("Calls listeners according to their priority", () => {
        const emitter = new utils_1.EventDispatcher();
        const calls = [];
        emitter.on("a", () => calls.push(3), 25);
        emitter.on("a", () => calls.push(1), 50);
        emitter.on("a", () => calls.push(2), 50);
        emitter.trigger("a");
        (0, assert_1.deepStrictEqual)(calls, [1, 2, 3]);
    });
});
//# sourceMappingURL=events.test.js.map