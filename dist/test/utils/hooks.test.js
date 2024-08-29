"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const hooks_1 = require("../../lib/utils/hooks");
describe("EventHooks", () => {
    it("Works in simple cases", () => {
        const emitter = new hooks_1.EventHooks();
        let calls = 0;
        emitter.on("a", () => {
            calls++;
        });
        (0, assert_1.deepStrictEqual)(calls, 0);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 1);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 2);
    });
    it("Works with once", () => {
        const emitter = new hooks_1.EventHooks();
        let calls = 0;
        emitter.once("a", () => {
            calls++;
        });
        (0, assert_1.deepStrictEqual)(calls, 0);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 1);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 1);
    });
    it("Allows removing listeners", () => {
        const emitter = new hooks_1.EventHooks();
        let calls = 0;
        const listener = () => {
            calls++;
        };
        emitter.once("a", listener);
        emitter.off("a", listener);
        (0, assert_1.deepStrictEqual)(calls, 0);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 0);
    });
    it("Works correctly with missing listeners", () => {
        const emitter = new hooks_1.EventHooks();
        let calls = 0;
        const listener = () => {
            calls++;
        };
        emitter.on("a", () => {
            calls++;
        });
        emitter.off("a", listener);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 1);
    });
    it("Works if a listener is removed while emitting", () => {
        const emitter = new hooks_1.EventHooks();
        let calls = 0;
        emitter.on("a", function rem() {
            calls++;
            emitter.off("a", rem);
        });
        emitter.on("a", () => {
            calls++;
        });
        (0, assert_1.deepStrictEqual)(calls, 0);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 2);
        emitter.emit("a");
        (0, assert_1.deepStrictEqual)(calls, 3);
    });
    it("Collects the results of listeners", () => {
        const emitter = new hooks_1.EventHooks();
        emitter.on("a", () => 1);
        emitter.on("a", () => 2);
        (0, assert_1.deepStrictEqual)(emitter.emit("a"), [1, 2]);
    });
    it("Calls listeners according to their order", () => {
        const emitter = new hooks_1.EventHooks();
        emitter.on("a", () => 1, 100);
        emitter.on("a", () => 2);
        (0, assert_1.deepStrictEqual)(emitter.emit("a"), [2, 1]);
    });
    it("Has a working momento mechanism", () => {
        const emitter = new hooks_1.EventHooks();
        emitter.on("a", () => 1);
        const momento = emitter.saveMomento();
        emitter.on("a", () => 2);
        (0, assert_1.deepStrictEqual)(emitter.emit("a"), [1, 2]);
        emitter.restoreMomento(momento);
        (0, assert_1.deepStrictEqual)(emitter.emit("a"), [1]);
    });
});
//# sourceMappingURL=hooks.test.js.map