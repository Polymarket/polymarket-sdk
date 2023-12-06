/**
 * Gets the index set corresponding to an array of market indices.
 * @param indices An array of market indices.
 * @returns The corresponding index set.
 */
const getIndexSet = (indices: number[]) =>
  // eslint-disable-next-line no-bitwise
  [...new Set(indices)].reduce((acc, index) => acc + (1 << index), 0);

export { getIndexSet };
