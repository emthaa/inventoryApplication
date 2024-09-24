const db = require("../db/queries");

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
    console.log(data)
    res.render("gameSelection", { games: data }); 
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addGenreRouterGet(req,res){
  try {
    res.render("addGenre"); 
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function addGenreRouterPost(req,res){
  try {
   const {genreName} = req.body; 
    await db.addGenre(genreName);
    res.redirect("/genres"); 
  } catch (err) {
    console.error("Error adding genre:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
    genresRouterGet,
    singleGenreRouterGet,
    addGenreRouterGet,
    addGenreRouterPost
};