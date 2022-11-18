exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Error 400 - Bad Request" });
  } else {
    next(err);
  }
};

//Catch all
exports.handleServerErrors = (err, req, res, next) => {
  console.log("Undandled error: ", err);
  res.sendStatus(500);
};
