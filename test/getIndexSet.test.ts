/* eslint-env jest */

import { getIndexSet } from "../src";

const testCases = [
  [[0], BigInt(1)],
  [[1], BigInt(2)],
  [[0, 1], BigInt(3)],
  [[0, 0, 1], BigInt(3)],
  [[2], BigInt(4)],
  [[0, 2], BigInt(5)],
  [[1, 2], BigInt(6)],
  [[0, 1, 2], BigInt(7)],
  [[3], BigInt(8)],
  [[0, 3], BigInt(9)],
  [[1, 3], BigInt(10)],
  [[0, 1, 3], BigInt(11)],
  [[2, 3], BigInt(12)],
  [[0, 2, 3], BigInt(13)],
  [[1, 2, 3], BigInt(14)],
  [[0, 1, 2, 3], BigInt(15)],
  [[33], BigInt(8589934592)],
] as [number[], bigint][];

describe("getIndexSet", () => {
  it.each(testCases)(`should get the index set`, (indices, expectedIndexSet) => {
    expect(getIndexSet(indices)).toEqual(expectedIndexSet);
  });
});
