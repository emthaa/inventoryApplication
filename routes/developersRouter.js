const { Router } = require("express");
const developersRouter = Router();
const developersController = require("../controllers/developersController");
const { check, validationResult } = require("express-validator");
const db = require("../db/queries");

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
  [
    check("developerName")
      .notEmpty()
      .withMessage("Developer name is required.")
      .isLength({ min: 3, max: 50 })
      .withMessage("Developer name must be 3-50 characters long.")
      .custom(async (value) => {
        const lowerCaseValue = value.toLowerCase();
        const existingDeveloper = await db.getSingleDeveloperByName(
          lowerCaseValue
        );

        if (existingDeveloper && existingDeveloper.length > 0) {
          throw new Error(
            "Developer name already exists. Please choose a different name."
          );
        }
        return true;
      }),
  ],
  developersController.addDeveloperRouterPost
);

developersRouter.get("/developers", developersController.developersRouterGet);
developersRouter.get(
  "/developers/:id",
  developersController.singleDeveloperRouterGet
);

module.exports = developersRouter;
