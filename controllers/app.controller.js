const express = require("express");
const categories = require("../db/data/development-data/categories");
const {
  selectCategories,
  selectReviews,
  selectCommentsByReviewId,
  selectReviewsById,
  insertCommentsByReviewId,
  updateReviewById,
  selectUsers,
  removeCommentsById,
} = require("../models/app.model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews(req.query)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewsByid = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewsById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  insertCommentsByReviewId(review_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReviewById(review_id, inc_votes)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
