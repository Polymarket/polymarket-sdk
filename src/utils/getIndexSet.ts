const getIndexSet = (indices: number[]) =>
  // eslint-disable-next-line no-bitwise
  [...new Set(indices)].reduce((acc, index) => acc + (1 << index), 0);

export { getIndexSet };
