const { Router } = require("express");
const genresRouter = Router();
const genresController = require("../controllers/genresController");
genresRouter.post("/genres/:id/delete", genresController.deleteGenreRouterPost);

genresRouter.get("/genres/add", genresController.addGenreRouterGet);
genresRouter.post("/genres/add", genresController.addGenreRouterPost);
genresRouter.get("/genres", genresController.genresRouterGet);
genresRouter.get("/genres/:id", genresController.singleGenreRouterGet);

module.exports = genresRouter;
