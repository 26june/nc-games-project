const express = require("express");
const { getCategories, getReviews } = require("./controllers/app.controller");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

//Not found 404
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error 404 - Not Found" });
});

//Catch all
app.use((err, req, res, next) => {
  console.log("Undandled error: ", err);
  res.sendStatus(500);
});

module.exports = app;
