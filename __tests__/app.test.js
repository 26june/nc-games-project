const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/index.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/categories", () => {
  test("GET: 200 - SEND AN ARRAY OF OBJECTS WHICH HAS A SLUG AND DESCRIPTION PROPERTY", () => {
    return request(app).get("/api/categories").expect(200);
  });
});
