const db = require("../db/queries");

async function developersRouterGet(req, res) {
  try {
    const data = await db.getDevelopers();
    console.log(data)
    res.render("developers", { developers: data }); 
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function singleDeveloperRouterGet(req, res) {
  try {
    const data = await db.getDeveloperGames(req.params.id);
    console.log(data)
    res.render("gameSelection", { games: data }); 
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addDeveloperRouterGet(req,res){
  try {
    res.render("addDeveloper")
   } catch (err) {
     console.error("Error adding game:", err);
     res.status(500).send("Internal Server Error");
   }
}

async function addDeveloperRouterPost(req,res){
  try {
    const {developerName} = req.body; 
    console.log(developerName)
     await db.addDeveloper(developerName);
     res.redirect("/games"); 
   } catch (err) {
     console.error("Error adding developer:", err);
     res.status(500).send("Internal Server Error");
   }
}

module.exports = {
    developersRouterGet,
    singleDeveloperRouterGet,
    addDeveloperRouterGet,
    addDeveloperRouterPost
};