const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/index.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/not-a-valid-link", () => {
  test("GET: 404 - INVALID LINKS SHOULD RESPOND WITH A NOT FOUND MESSAGE", () => {
    return request(app)
      .get("/invalidLink")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Error 404 - Not Found");
      });
  });
});

describe("/api/categories", () => {
  test("GET: 200 - SEND AN ARRAY OF OBJECTS WHICH HAS A SLUG AND DESCRIPTION PROPERTY", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toEqual(expect.any(Array));
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
