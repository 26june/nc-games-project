const express = require("express");
const { getCategories } = require("./controllers/app.controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

//Catch all
app.use((err, req, res, next) => {
  console.log("Undandled error: ", err);
  res.sendStatus(500);
});

module.exports = app;
