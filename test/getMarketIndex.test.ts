/* eslint-env jest */

import { getMarketIndex } from "../src";

const testCases: [string, number][] = [
  ["0xb20c874543db3de05e85f24dc912e915a641c579db553ff12ed135a68b3f7500", 0],
  ["0xb20c874543db3de05e85f24dc912e915a641c579db553ff12ed135a68b3f7501", 1],
  ["0xb20c874543db3de05e85f24dc912e915a641c579db553ff12ed135a68b3f7510", 16],
  ["0x1d2daa077aa4441be685c80a2ffac5c962eebf791ee72b8d178bfaf305847c11", 17],
  ["0x1d2daa077aa4441be685c80a2ffac5c962eebf791ee72b8d178bfaf305847cFF", 255],
  ["0x1d2daa077aa4441be685c80a2ffac5c962eebf791ee72b8d178bfaf305847c0A", 10],
];

describe("getMarketIndex", () => {
  it.each(testCases)(`should get the market index`, (questionId, expectedMarketIndex) => {
    expect(getMarketIndex(questionId)).toEqual(expectedMarketIndex);
  });
});
