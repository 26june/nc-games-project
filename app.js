const express = require("express");
const {
  getCategories,
  getReviews,
  getCommentsByReviewId,
  getReviewsByid,
  postCommentsByReviewId,
  patchByReviewId,
  getUsers,
  deleteCommentById,
  getApi,
} = require("./controllers/app.controller");
const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).send({ msg: "SERVER UP AND RUNNING" });
});

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewsByid);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchByReviewId);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api", getApi);

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
