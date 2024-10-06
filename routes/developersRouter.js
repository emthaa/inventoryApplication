const { Router } = require("express");
const developersRouter = Router();
const developersController = require("../controllers/developersController");
developersRouter.post(
  "/developers/:id/delete",
  developersController.deleteDeveloperRouterPost
);

developersRouter.get(
  "/developers/add",
  developersController.addDeveloperRouterGet
);
developersRouter.post(
  "/developers/add",
  developersController.addDeveloperRouterPost
);
developersRouter.get("/developers", developersController.developersRouterGet);
developersRouter.get(
  "/developers/:id",
  developersController.singleDeveloperRouterGet
);

module.exports = developersRouter;
