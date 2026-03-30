module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/services/**/*.js",
    "src/controllers/**/*.js"
  ],
  testMatch: [
    "**/tests/**/*.test.js"
  ],
};