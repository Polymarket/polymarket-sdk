module.exports = {
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/*.d.ts"],
  coveragePathIgnorePatterns: ["node_modules"],
  coverageReporters: ["lcov", "html"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.ts"],
};
