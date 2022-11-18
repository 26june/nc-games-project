const {
  getUsers,
  getUsersByUsernames,
} = require("../controllers/app.controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

userRouter.route("/:username").get(getUsersByUsernames);

module.exports = userRouter;
