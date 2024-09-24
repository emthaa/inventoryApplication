const pool = require("./pool");

async function getGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}

async function getSingleGame(id) {
  const { rows } = await pool.query(`SELECT * FROM games WHERE id=${id}`);
  return rows;
}
// SELECT games.name FROM games INNER JOIN genres ON games.id = genres.id WHERE genres.name = 'Adventure';
// SELECT games.name FROM games INNER JOIN game_genres ON games.id = game_genres.game_id;

async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getSingleGenre(genre_id) {
  const { rows } = await pool.query(`SELECT * FROM genres WHERE id=${genre_id}`);
  return rows;
}

async function getGameGenresIds(game_id){
  const { rows } = await pool.query(`SELECT * FROM game_genres WHERE game_id=${game_id}`);
  return rows;
}


async function getGameGenres(game_id) {
  try {
    const gameGenresIds = await getGameGenresIds(game_id);
    const genreNames = [];

    for (const gameGenresId of gameGenresIds) {
      const genreData = await getSingleGenre(gameGenresId.genre_id);
      genreNames.push(genreData[0].name);
    }

    return genreNames;
  } catch (error) {
    console.error('Error fetching game genres:', error);
    return [];
  }
}

async function getDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers");
  return rows;
}

async function getSingleDeveloper(developer_id) {
  const { rows } = await pool.query(`SELECT * FROM developers WHERE id=${developer_id}`);
  return rows;
}

async function getGameDevelopersIds(game_id){
  const { rows } = await pool.query(`SELECT * FROM game_developers WHERE game_id=${game_id}`);
  return rows;
}

async function getGameDevelopers(game_id) {
  try {
    const gameDevelopersIds = await getGameDevelopersIds(game_id);
    const developerNames = [];

    for (const gameDevelopersId of gameDevelopersIds) {
      const developerData = await getSingleDeveloper(gameDevelopersId.developer_id);
      developerNames.push(developerData[0].name);
    }

    return developerNames;
  } catch (error) {
    console.error('Error fetching game developers:', error);
    return [];
  }
}

async function getDeveloperGames(developer_id){
  let gameIds = [];
  let games = [];
  
  const { rows } = await pool.query(`SELECT * FROM game_developers WHERE developer_id=${developer_id}`);
  
  rows.forEach((row) => {
    gameIds.push(row.game_id);
  });
  
  games = await Promise.all(gameIds.map(async (gameId) => {
    return await getSingleGame(gameId); 
  }));
  return games;
}

async function getGenreGames(genre_id){
  let gameIds = [];
  let games = [];
  
  const { rows } = await pool.query(`SELECT * FROM game_genres WHERE genre_id=${genre_id}`);
  
  rows.forEach((row) => {
    gameIds.push(row.game_id);
  });
  
  games = await Promise.all(gameIds.map(async (gameId) => {
    return await getSingleGame(gameId); 
  }));
  console.log(games[0])
  return games;
}

async function addGenre(name){
  const { rows } = await pool.query(`INSERT INTO genres (name) VALUES ('${name}');`);
  return rows
}

async function addDeveloper(name){
  const { rows } = await pool.query(`INSERT INTO developers (name) VALUES ('${name}');`);
  return rows
}

async function addGame(name){
  const { rows } = await pool.query(`INSERT INTO games (name) VALUES ('${name}');`);
  return rows
}

async function getLatestGameEntry(){
  const { rows } = await pool.query(`SELECT MAX(id) AS id FROM games;`);
  return rows
}

async function linkGameToGenre(game_id,genre_id){
  await pool.query(`INSERT INTO game_genres (game_id, genre_id) VALUES (${game_id}, ${genre_id})`)
}

async function linkGameToDeveloper(game_id,developer_id){
  await pool.query(`INSERT INTO game_developers (game_id, developer_id) VALUES (${game_id}, ${developer_id})`)
}

module.exports = {
  getGames,
  getSingleGame,
  getGameGenres,
  getGameDevelopers,
  getGenres,
  getDevelopers,
  getDeveloperGames,
  getGenreGames,
  addGenre,
  addDeveloper,
  addGame,
  getLatestGameEntry,
  linkGameToGenre,
  linkGameToDeveloper

};
