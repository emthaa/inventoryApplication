const { Router } = require("express");
const genresRouter = Router();
const genresController = require("../controllers/genresController");
const { check, validationResult } = require("express-validator");
const db = require("../db/queries");

genresRouter.post("/genres/:id/delete", genresController.deleteGenreRouterPost);

genresRouter.get("/genres/add", genresController.addGenreRouterGet);
genresRouter.post(
  "/genres/add",
  [
    check("genreName")
      .notEmpty()
      .withMessage("Genre name is required.")
      .isLength({ min: 3, max: 25 })
      .withMessage("Genre name must be 3-25 characters long.")
      .custom(async (value) => {
        const lowerCaseValue = value.toLowerCase();
        const existingGenre = await db.getSingleGenreByName(lowerCaseValue);
        console.log(existingGenre, lowerCaseValue);
        if (existingGenre && existingGenre.length > 0) {
          throw new Error(
            "Genre name already exists. Please choose a different name."
          );
        }
        return true;
      }),
  ],
  genresController.addGenreRouterPost
);

genresRouter.get("/genres", genresController.genresRouterGet);
genresRouter.get("/genres/:id", genresController.singleGenreRouterGet);

module.exports = genresRouter;
