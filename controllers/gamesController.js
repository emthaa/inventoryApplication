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
  } catch(err) {
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


module.exports = {
  gamesRouterGet,
  singleGameRouterGet,
  addGameRouterGet,
  addGameRouterPost,
};
