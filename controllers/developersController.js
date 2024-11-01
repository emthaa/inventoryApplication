const db = require("../db/queries");
const { validationResult } = require("express-validator");

async function developersRouterGet(req, res) {
  try {
    const data = await db.getDevelopers();
    res.render("developers", { developers: data });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function singleDeveloperRouterGet(req, res) {
  try {
    const data = await db.getDeveloperGames(req.params.id);
    const developerUrl = req.originalUrl;
    res.render("gameSelection", {
      games: data,
      getBy: "developers",
      developerUrl: developerUrl,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addDeveloperRouterGet(req, res) {
  try {
    res.render("addDeveloper", { errors: [] });
  } catch (err) {
    console.error("Error adding developer:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addDeveloperRouterPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("addDeveloper", {
      errors: errors.array(),
    });
  }

  try {
    const { developerName } = req.body;
    await db.addDeveloper(developerName);
    res.redirect("/developers");
  } catch (err) {
    console.error("Error adding developer:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteDeveloperRouterPost(req, res) {
  try {
    const developerId = req.params.id;
    const developersGames = await db.getDeveloperGames(developerId);

    for (const game of developersGames) {
      await db.deleteGame(game[0].id);
    }

    await db.deleteDeveloper(developerId);
    res.redirect("/developers");
  } catch (err) {
    console.error("Error adding developer:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  developersRouterGet,
  singleDeveloperRouterGet,
  addDeveloperRouterGet,
  addDeveloperRouterPost,
  deleteDeveloperRouterPost,
};
