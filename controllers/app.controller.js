const express = require("express");
const categories = require("../db/data/development-data/categories");
const { selectCategories } = require("../models/app.model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

