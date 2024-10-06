const db = require("../db/queries");

async function developersRouterGet(req, res) {
  try {
    const data = await db.getDevelopers();
    console.log(data);
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
    console.log(data);
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
    res.render("addDeveloper");
  } catch (err) {
    console.error("Error adding game:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addDeveloperRouterPost(req, res) {
  try {
    const { developerName } = req.body;
    console.log(developerName);
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
    console.log(req.params.id);
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
