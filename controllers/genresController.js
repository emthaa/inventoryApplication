const db = require("../db/queries");
const { validationResult } = require("express-validator");

async function genresRouterGet(req, res) {
  try {
    const data = await db.getGenres();
    res.render("genres", { genres: data });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function singleGenreRouterGet(req, res) {
  try {
    const data = await db.getGenreGames(req.params.id);
    const genreUrl = req.originalUrl;
    res.render("gameSelection", {
      games: data,
      getBy: "genres",
      genreUrl: genreUrl,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addGenreRouterGet(req, res) {
  try {
    res.render("addGenre", { errors: [] });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addGenreRouterPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("addGenre", {
      errors: errors.array(),
    });
  }

  try {
    const { genreName } = req.body;
    await db.addGenre(genreName);
    res.redirect("/genres");
  } catch (err) {
    console.error("Error adding genre:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteGenreRouterPost(req, res) {
  try {
    const genreId = req.params.id;
    const genresGames = await db.getGenreGames(genreId);

    for (const game of genresGames) {
      await db.deleteGame(game[0].id);
    }
    await db.deleteGenre(genreId);
    res.redirect("/genres");
  } catch (err) {
    console.error("Error adding genre:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  genresRouterGet,
  singleGenreRouterGet,
  addGenreRouterGet,
  addGenreRouterPost,
  deleteGenreRouterPost,
};
