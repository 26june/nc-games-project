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

  describe("/api/reviews (queries)", () => {
    //Category
    test("GET: 200 - RESPONDS WITH THE REVIEW ARRAY IF THE CATEGORY QUERY IS OMITTED", () => {
      return request(app)
        .get("/api/reviews?category")
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

  test("GET: 200 - RESPONDS WITH THE REVIEW ARRAY WITH THE SPECIFIED CATEGORY VALUE", () => {
    return request(app)
      .get("/api/reviews?category=euro game")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(1);
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: "euro game",
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String), //SQL sends this back as a string
          });
        });
      });
  });

  test("GET: 200 - RESPONDS WITH AN EMPTY IF THE SPECIFIED CATEGORY VALUE IS EMPTY ", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual(expect.any(Array));
        expect(reviews).toHaveLength(0);
      });
  });

  test("GET: 400 - WRONG QUERY SPELLING", () => {
    return request(app)
      .get("/api/reviews?caterogy")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  //sort_by
  test("GET: 200 - RESPONDS WITH THE REVIEW ARRAY THAT DEFAULTS TO SORTED BY DATE", () => {
    return request(app)
      .get("/api/reviews?sort_by")
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

  test("GET: 200 - REVIEW ARRAY SORTED BY THE SPECIFIED QUERTY (ORDER DEFAULT = DESC)", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner")
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
        expect(reviews).toBeSortedBy("owner", { descending: true });
      });
  });

  test("GET: 400 - INVALID SORT BY COLUMN", () => {
    return request(app)
      .get("/api/reviews?sort_by=gj")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  //order
  test("GET: 200 - REVIEW ORDER DEFAULTS DESCENDING ", () => {
    return request(app)
      .get("/api/reviews?order")
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

  test("GET: 200 - REVIEW ORDER IS ASCENDING ", () => {
    return request(app)
      .get("/api/reviews?order=asc")
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
        expect(reviews).toBeSortedBy("created_at", { descending: false });
      });
  });

  test("GET - 400: INVALID ORDER RESPONDS WITH MESSAGE", () => {
    return request(app)
      .get("/api/reviews?order=gj")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Error 400 - Bad Request");
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
          comment_count: expect.any(String),
          //^sql returns this as a string
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

  test("PATCH: 201 - SHOULD RESPOND WITH THE UPDATED REVIEW (ADD)", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 1 })
      .expect(201)
      .then(({ body }) => {
        const { review } = body;

        expect(review).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: 6,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });

  test("PATCH: 201 - SHOULD RESPOND WITH THE UPDATED REVIEW (SUBTRACT)", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -100 })
      .expect(201)
      .then(({ body }) => {
        const { review } = body;

        expect(review).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: -95,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });

  test("PATCH: 400 - SHOULD RESPOND WITH MESSAGE GIVEN A STRING", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: "one" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  test("PATCH: 404 - RESPONDS WITH A MESSAGE GIVEN A NON EXISTING ID ", () => {
    return request(app)
      .patch("/api/reviews/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 404 - Not Found");
      });
  });

  test("PATCH: 400 - SHOULD RESPOND WITH A MESSAGE GIVEN AN INVALID ID ", () => {
    return request(app)
      .patch("/api/reviews/stringnine")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  test("PATCH: 200 - SHOULD IGNORE EXTRA PROPERTIES GIVEN IN THE REQUEST BODY", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 5, extraKey: 7 })
      .expect(201)
      .then(({ body }) => {
        const { review } = body;

        expect(review).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: 10,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });

        expect(Object.keys(review)).not.toEqual(
          expect.arrayContaining(["extraKey"])
        );
      });
  });

  test("PATCH: 400 - RESPONDS WITH A MESSAGE GIVEN AN INVALID KEY IN THE REQUEST BODY", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inv_cotes: 1 })
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

  test("GET 400: RESPONDS WITH A MESSAGE IF REVIEW IS A STRING", () => {
    return request(app)
      .get("/api/reviews/notanumber/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  test("POST 201: RESPONDS WITH THE POSTED COMMENT", () => {
    const bodyToPost = {
      username: "mallionaire",
      body: "its ok",
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(bodyToPost)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          review_id: 1,
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });

  test("POST 400: REQUEST BODY IS MISSING A REQUIRED KEY", () => {
    const bodyToPost = {
      body: "its ok",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(bodyToPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  test("POST 404: RESPONDS WITH A MESSAGE IF REVIEW ID DOES NOT EXIST", () => {
    const bodyToPost = {
      username: "mallionaire",
      body: "its ok",
    };

    return request(app)
      .post("/api/reviews/9999/comments")
      .send(bodyToPost)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 404 - Not Found");
      });
  });

  test("POST 400: RESPONDS WITH A MESSAGE IF REVIEW IS STRING", () => {
    const bodyToPost = {
      username: "mallionaire",
      body: "its ok",
    };

    return request(app)
      .post("/api/reviews/notanumber/comments")
      .send(bodyToPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  test("POST 200: EXTRA KEY SHOULD BE IGNORED", () => {
    const bodyToPost = {
      username: "mallionaire",
      body: "its ok",
      slug: "slug",
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(bodyToPost)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          review_id: 1,
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
        //not have a key of slug
        expect(Object.keys(comment)).not.toEqual(
          expect.arrayContaining(["slug"])
        );
      });
  });

  test("POST 400 - RESPONDS WITH A MESSAGE GIVEN THAT REQUEST BODY IS WRONG DATA TYPE", () => {
    const bodyToPost = {
      username: "mallionaire",
      body: 123,
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(bodyToPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });

  test("POST 400 - RESPONDS WITH A MESSAGE GIVEN THAT THE REQUEST BODY HAS INVALID KEYS", () => {
    const bodyToPost = {
      usernam: "mallionaire",
      bDY: "its ok",
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(bodyToPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Error 400 - Bad Request");
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 - SHOULD RESPOND WITH AN ARRAY OF OBJECT WHICH HAS SEVERAL PROPERTIES", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toEqual(expect.any(Array));
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
