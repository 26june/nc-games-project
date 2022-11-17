const devData = require("./development-data");
const testData = require("./test-data");

const ENV = process.env.NODE_ENV || "development";

const data = { test: testData, development: devData, production: devData };

module.exports = data[ENV];
