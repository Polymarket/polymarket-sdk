/**
 * Gets the index of a neg-risk market index from the questionId.
 * @remarks
 * The last byte of the questionId contains the index of the neg-risk market.
 * @param questionId The questionId of the neg-risk market.
 * @returns The index of the neg-risk market.
 */
const getMarketIndex = (questionId: string): number => parseInt(questionId.slice(-2), 16);

export { getMarketIndex };
