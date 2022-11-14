const db = require("../db/connection");

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
