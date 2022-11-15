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

describe("/api/reviews", () => {
  test("GET: 200 - SEND AN ARRAY OF OBJECTS WITH SEVERAL PROPERTIES SORTED BY DATE IN DESCENDING ORDER", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String), //SQL sends this back as a string
          });
        });
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET: 200 - SHOULD RESPOND WITH AN OBJECT CONTAINING SEVERAL REVIEW PROPERTIES", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("GET: 404 - SHOULD RESPOND WITH A MESSAGE GIVEN A IF THE REVIEW ID IS NOT FOUND", () => {
    return request(app)
      .get("/api/reviews/9999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 404 - Not Found");
      });
  });
  test("GET: 400 - SHOULD RESPOND WITH A MESSAGE GIVEN AN INVALID ID", () => {
    return request(app)
      .get("/api/reviews/stringone")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET 200: SEND AN ARRAY OF OBJECTS WITH COMMENT PROPERTIES ", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });

  test("GET 200: RESPONDS WITH AN EMPTY ARRAY GIVEN AN EXISTING ID WITH NO COMMENTS", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual(expect.any(Array));
        expect(comments).toHaveLength(0);
      });
  });

  test("GET 404: RESPONDS WITH A MESSAGE IF REVIEW ID DOES NOT EXIST", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 404 - Not Found");
      });
  });

  test("GET 400: RESPONDS WITH A MESSAGE IF REVIEW IS", () => {
    return request(app)
      .get("/api/reviews/notanumber/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });
});
