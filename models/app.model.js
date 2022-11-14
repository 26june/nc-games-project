const db = require("../db/connection");

exports.selectCategories = () => {
  const queryStr = `
        SELECT * FROM categories;
    `;

  return db.query(queryStr).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};
