const db = require("../db/connection");
const { checkReviewIdExist } = require("../db/seeds/utils");

exports.selectCategories = () => {
  const queryStr = `
        SELECT * FROM categories;
    `;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.selectReviews = () => {
  const queryStr = `
        SELECT reviews.* , COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY created_at DESC;
    `;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.selectReviewsById = (review_id) => {
  const queryStr = `
        SELECT * FROM reviews 
        WHERE review_id = $1
    `;

  return db.query(queryStr, [review_id]).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, msg: "Error 404 - Not Found" });
    } else {
      return rows[0];
    }
  });
};

exports.selectCommentsByReviewId = (review_id) => {
  const queryStr = `
      SELECT * from comments WHERE review_id = $1;
  `;
  return checkReviewIdExist(review_id)
    .then(() => {
      return db.query(queryStr, [review_id]);
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentsByReviewId = (review_id, bodyToPost) => {
  const { username, body } = bodyToPost;
  if (
    !username ||
    !body ||
    typeof body !== "string" ||
    typeof username !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Error 400 - Bad Request" });
  }

  const queryStr = `INSERT INTO comments (body, votes, author, review_id) VALUES ($1, $2, $3, $4) RETURNING*`;

  return checkReviewIdExist(review_id)
    .then(() => {
      return db.query(queryStr, [body, 0, username, review_id]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateReviewById = (review_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Error 400 - Bad Request" });
  }
  const queryStr = `
    UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;
  `;

  return db.query(queryStr, [inc_votes, review_id]).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, msg: "Error 404 - Not Found" });
    } else {
      return rows[0];
    }
  });
};

exports.selectUsers = () => {
  const queryStr = `
    SELECT * FROM users;
  `;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
