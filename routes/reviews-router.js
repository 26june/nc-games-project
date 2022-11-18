const {
  getReviews,
  getReviewsByid,
  getCommentsByReviewId,
  postCommentsByReviewId,
  patchByReviewId,
} = require("../controllers/app.controller");

const reviewsRouters = require("express").Router();

reviewsRouters.route("/").get(getReviews);

reviewsRouters.route("/:review_id").get(getReviewsByid).patch(patchByReviewId);

reviewsRouters
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentsByReviewId);

module.exports = reviewsRouters;
