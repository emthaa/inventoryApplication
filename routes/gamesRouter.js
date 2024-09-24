const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController");

gamesRouter.post("/games/add", gamesController.addGameRouterPost);
gamesRouter.get("/games/add", gamesController.addGameRouterGet);

gamesRouter.get("/games", gamesController.gamesRouterGet);
gamesRouter.get("/games/:id", gamesController.singleGameRouterGet);


module.exports = gamesRouter;