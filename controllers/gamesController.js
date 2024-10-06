const db = require("../db/queries");

async function gamesRouterGet(req, res) {
  try {
    const data = await db.getGames();
    res.render("games", { games: data });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function singleGameRouterGet(req, res) {
  try {
    const gameId = req.params.id;
    const gameData = await db.getSingleGame(gameId);
    const gameGenreData = await db.getGameGenres(gameId);
    const gameDeveloperData = await db.getGameDevelopers(gameId);

    res.render("singleGame", {
      game: gameData,
      game_genre: gameGenreData,
      game_developer: gameDeveloperData,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addGameRouterGet(req, res) {
  try {
    const developerData = await db.getDevelopers();
    const genresData = await db.getGenres();
    console.log(developerData);
    res.render("addGame", { developers: developerData, genres: genresData });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addGameRouterPost(req, res) {
  try {
    const { gameName, gameGenresIds, gameDeveloperId } = req.body;

    await db.addGame(gameName);
    const tempGameId = await db.getLatestGameEntry();
    const gameId = tempGameId[0].id;

    console.log(gameName, gameGenresIds, gameDeveloperId, gameId);

    for (const genreId of gameGenresIds) {
      await db.linkGameToGenre(gameId, genreId);
    }

    await db.linkGameToDeveloper(gameId, gameDeveloperId);

    res.redirect("/games");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function editGameRouterGet(req, res) {
  try {
    const gameId = req.params.id;

    const game = await db.getSingleGame(gameId);

    const gameGenresIds = await db.getGameGenresIds(gameId);
    const genres = await db.getGenres();

    const gameDeveloperIds = await db.getGameDevelopersIds(gameId);
    const developers = await db.getDevelopers();

    res.render("editGame", {
      game: game,
      gameGenresIds: gameGenresIds,
      genres: genres,
      developers: developers,
      gameDeveloperIds: gameDeveloperIds,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function editGameRouterPost(req, res) {
  try {
    const { gameName, gameGenresIds, gameDeveloperId } = req.body;
    const gameId = req.params.id;
    await db.editGameEntry(gameId, gameName, gameGenresIds, gameDeveloperId);
    res.redirect("/games");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteGameRouterPost(req, res) {
  try {
    // query to delete game
    // delete all game connections to developers and genres

    const gameId = req.params.id;
    console.log(gameId);
    await db.deleteGame(gameId);
    res.redirect("/games");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  gamesRouterGet,
  singleGameRouterGet,
  addGameRouterGet,
  addGameRouterPost,
  editGameRouterGet,
  editGameRouterPost,
  deleteGameRouterPost,
};
