/* eslint-env jest */

import { getIndexSet } from "../src";

const testCases = [
  [[0], 1],
  [[1], 2],
  [[0, 1], 3],
  [[0, 0, 1], 3],
  [[2], 4],
  [[0, 2], 5],
  [[1, 2], 6],
  [[0, 1, 2], 7],
  [[3], 8],
  [[0, 3], 9],
  [[1, 3], 10],
  [[0, 1, 3], 11],
  [[2, 3], 12],
  [[0, 2, 3], 13],
  [[1, 2, 3], 14],
] as [number[], number][];

describe("getIndexSet", () => {
  it.each(testCases)(`should compute the index set`, (indices, expectedIndexSet) => {
    expect(getIndexSet(indices)).toEqual(expectedIndexSet);
  });
});
