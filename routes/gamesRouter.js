const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController");
const { check, validationResult } = require("express-validator");
const db = require("../db/queries");

gamesRouter.post("/games/:id/delete", gamesController.deleteGameRouterPost);

gamesRouter.get("/games/:id/edit", gamesController.editGameRouterGet);
gamesRouter.post(
  "/games/:id/edit",
  [
    check("gameName")
      .notEmpty()
      .withMessage("Game name is required.")
      .isLength({ min: 3, max: 100 })
      .withMessage("Game name must be 3-100 characters long.")
      .custom(async (value, { req }) => {
        const lowerCaseValue = value.toLowerCase();
        const existingGame = await db.getSingleGameByName(lowerCaseValue);
        if (
          existingGame &&
          existingGame.length > 0 &&
          existingGame[0].id !== parseInt(req.params.id)
        ) {
          throw new Error(
            "Game name already exists. Please choose a different name."
          );
        }
        return true;
      }),
    check("gameGenresIds")
      .customSanitizer((value) => {
        return Array.isArray(value) ? value : value ? [value] : [];
      })
      .isArray({ min: 1 })
      .withMessage("At least one genre must be selected.")
      .custom((value, { req }) => {
        console.log(
          "gameGenresIds (post-sanitization):",
          req.body.gameGenresIds
        );
        return true;
      }),
  ],
  gamesController.editGameRouterPost
);

gamesRouter.post(
  "/games/add",
  [
    check("gameName")
      .notEmpty()
      .withMessage("Game name is required.")
      .isLength({ min: 3, max: 100 })
      .withMessage("Game name must be 3-100 characters long.")
      .custom(async (value) => {
        const lowerCaseValue = value.toLowerCase();
        const existingGame = await db.getSingleGameByName(lowerCaseValue);
        if (existingGame && existingGame.length > 0) {
          throw new Error(
            "Game name already exists. Please choose a different name."
          );
        }
        return true;
      }),
    check("gameGenresIds")
      .customSanitizer((value) => {
        return Array.isArray(value) ? value : value ? [value] : [];
      })
      .isArray({ min: 1 })
      .withMessage("At least one genre must be selected."),
  ],
  gamesController.addGameRouterPost
);

gamesRouter.get("/games/add", gamesController.addGameRouterGet);

gamesRouter.get("/games", gamesController.gamesRouterGet);
gamesRouter.get("/games/:id", gamesController.singleGameRouterGet);

module.exports = gamesRouter;
