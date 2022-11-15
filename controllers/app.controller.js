const express = require("express");
const categories = require("../db/data/development-data/categories");
const {
  selectCategories,
  selectReviews,
  selectCommentsByReviewId,
} = require("../models/app.model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id).then((comments) => {
    res.status(200).send({ comments });
  });
};
