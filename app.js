const express = require("express");
const {
  getCategories,
  getReviews,
  getCommentsByReviewId,
  getReviewsByid,
} = require("./controllers/app.controller");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsByid);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);


//Custom error
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Error 400 - Bad Request" });
  } else {
    next(err);
  }
});

//Not found 404
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//Not found 404 (Generic)
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error 404 - Not Found" });
});

//Catch all
app.use((err, req, res, next) => {
  console.log("Undandled error: ", err);
  res.sendStatus(500);
});

module.exports = app;
