const express = require("express");
const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./errors");

const cors = require("cors");

const apiRouter = require("./routes/api-router");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).send({ msg: "SERVER UP AND RUNNING" });
});

app.use("/api", apiRouter);

//Not found 404 (Generic)
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Error 404 - Not Found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
