"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const array_1 = require("../../lib/utils/array");
describe("Array utils", () => {
    describe("insertPrioritySorted", () => {
        const item1 = { priority: 1 };
        const item2 = { priority: 2 };
        const item3 = { priority: 3 };
        const item4 = { priority: 4 };
        it("works with an empty array", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertPrioritySorted)([], item1), [item1]);
        });
        it("inserts at the start", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertPrioritySorted)([item1], item2), [item2, item1]);
        });
        it("inserts in the middle", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertPrioritySorted)([item3, item1], item2), [
                item3,
                item2,
                item1,
            ]);
        });
        it("inserts at the end", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertPrioritySorted)([item4, item3], item2), [
                item4,
                item3,
                item2,
            ]);
        });
        it("inserts new items last", () => {
            const item0 = { priority: 1, first: false };
            (0, assert_1.deepStrictEqual)((0, array_1.insertPrioritySorted)([item1], item0), [item1, item0]);
        });
    });
    describe("insertOrderSorted", () => {
        const item1 = { order: 1 };
        const item2 = { order: 2 };
        const item3 = { order: 3 };
        const item4 = { order: 4 };
        it("works with an empty array", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertOrderSorted)([], item1), [item1]);
        });
        it("inserts at the start", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertOrderSorted)([item2], item1), [item1, item2]);
        });
        it("inserts in the middle", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertOrderSorted)([item1, item3], item2), [
                item1,
                item2,
                item3,
            ]);
        });
        it("inserts at the end", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.insertOrderSorted)([item2, item3], item4), [
                item2,
                item3,
                item4,
            ]);
        });
        it("inserts new items last", () => {
            const item0 = { order: 1, last: true };
            (0, assert_1.deepStrictEqual)((0, array_1.insertOrderSorted)([item1], item0), [item1, item0]);
        });
    });
    describe("binaryFindPartition", () => {
        const always = () => true;
        it("works with empty array", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.binaryFindPartition)([], always), -1);
        });
        it("works with one item", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.binaryFindPartition)([1], always), 0);
        });
        it("works with more items", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.binaryFindPartition)([1, 2, 3], (n) => n > 2), 2);
            (0, assert_1.deepStrictEqual)((0, array_1.binaryFindPartition)([1, 2, 3, 4, 5, 6, 7], (n) => n > 5), 5);
        });
        it("works with no partition", () => {
            (0, assert_1.deepStrictEqual)((0, array_1.binaryFindPartition)([1, 2, 3], () => false), -1);
        });
        it("works with big arrays", () => {
            const index = 50168;
            const arr = Array.from({ length: 1e5 })
                .fill(0, 0, index)
                .fill(1, index);
            (0, assert_1.deepStrictEqual)((0, array_1.binaryFindPartition)(arr, (v) => v === 1), index);
        });
    });
    describe("removeIfPresent", () => {
        it("Supports a missing array", () => {
            (0, assert_1.doesNotThrow)(() => (0, array_1.removeIfPresent)(undefined, true));
        });
        it("Does not remove items if the item is not in the array", () => {
            const arr = [1, 2, 3];
            (0, array_1.removeIfPresent)(arr, 4);
            (0, assert_1.deepStrictEqual)(arr, [1, 2, 3]);
        });
        it("Removes a single item if it is present in the array", () => {
            const arr = [1, 2, 1];
            (0, array_1.removeIfPresent)(arr, 1);
            (0, assert_1.deepStrictEqual)(arr, [2, 1]);
        });
    });
});
//# sourceMappingURL=array.test.js.map