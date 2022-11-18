const apiRouter = require("express").Router();
const { getApi } = require("../controllers/app.controller");
const userRouter = require("./users-router");
const categoriesRouter = require("./categories-router");
const reviewsRouters = require("./reviews-router");
const commentsRouter = require("./comments-router");

apiRouter.get("/", getApi);

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/reviews", reviewsRouters);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
