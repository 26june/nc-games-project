const { getUsers } = require("../controllers/app.controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

module.exports = userRouter;
