const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

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
    res.render("addGame", {
      developers: developerData,
      genres: genresData,
      errors: [],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addGameRouterPost(req, res) {
  const errors = validationResult(req);
  const developerData = await db.getDevelopers();
  const genresData = await db.getGenres();
  if (!errors.isEmpty()) {
    return res.status(400).render("addGame", {
      developers: developerData,
      genres: genresData,
      errors: errors.array(),
    });
  }

  try {
    const { gameName, gameGenresIds, gameDeveloperId } = req.body;
    await db.addGame(gameName);
    const tempGameId = await db.getLatestGameEntry();
    const gameId = tempGameId[0].id;

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
      errors: [],
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function editGameRouterPost(req, res) {
  const errors = validationResult(req);
  const developerData = await db.getDevelopers();
  const genresData = await db.getGenres();

  if (!errors.isEmpty()) {
    return res.status(400).render("editGame", {
      developers: developerData,
      genres: genresData,
      errors: errors.array(),
      game: await db.getSingleGame(req.params.id),
      gameGenresIds: await db.getGameGenresIds(req.params.id),
      gameDeveloperIds: await db.getGameDevelopersIds(req.params.id),
    });
  }

  try {
    const { gameName, gameGenresIds, gameDeveloperId } = req.body;
    const gameId = req.params.id;

    const sanitizedGenresIds = Array.isArray(gameGenresIds)
      ? gameGenresIds
      : [];

    await db.editGameEntry(
      gameId,
      gameName,
      sanitizedGenresIds,
      gameDeveloperId
    );
    res.redirect("/games");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteGameRouterPost(req, res) {
  try {
    const gameId = req.params.id;
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
