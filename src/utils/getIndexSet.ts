/**
 * Gets the index set corresponding to an array of market indices using BigInt.
 * This version supports indices up to 100 (or more) by utilizing BigInt arithmetic.
 * @param indices An array of market indices.
 * @returns The corresponding index set as a BigInt.
 */
const getIndexSet = (indices: number[]): bigint =>
  [...new Set(indices)].reduce((acc, index) => acc + (1n << BigInt(index)), 0n);

export { getIndexSet };
