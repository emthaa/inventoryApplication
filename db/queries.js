const pool = require("./pool");

async function getGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}

async function getSingleGame(id) {
  const { rows } = await pool.query(`SELECT * FROM games WHERE id = $1`, [id]);
  return rows;
}

async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getSingleGenre(genre_id) {
  const { rows } = await pool.query(`SELECT * FROM genres WHERE id = $1`, [
    genre_id,
  ]);
  return rows;
}

async function getGameGenresIds(game_id) {
  const { rows } = await pool.query(
    `SELECT * FROM game_genres WHERE game_id = $1`,
    [game_id]
  );
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
    console.error("Error fetching game genres:", error);
    return [];
  }
}

async function getDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers");
  return rows;
}

async function getSingleDeveloper(developer_id) {
  const { rows } = await pool.query(`SELECT * FROM developers WHERE id = $1`, [
    developer_id,
  ]);
  return rows;
}

async function getSingleDeveloperByName(developer_name) {
  const result = await pool.query(
    "SELECT * FROM developers WHERE LOWER(name) = LOWER($1)",
    [developer_name]
  );
  return result.rows;
}

async function getSingleGenreByName(genre_name) {
  const result = await pool.query(
    "SELECT * FROM genres WHERE LOWER(name) = LOWER($1)",
    [genre_name]
  );
  return result.rows;
}

async function getGameDevelopersIds(game_id) {
  const { rows } = await pool.query(
    `SELECT * FROM game_developers WHERE game_id = $1`,
    [game_id]
  );
  return rows;
}
async function getSingleGameByName(game_name) {
  const result = await pool.query(
    "SELECT * FROM games WHERE LOWER(name) = LOWER($1)",
    [game_name]
  );
  return result.rows;
}

async function getGameDevelopers(game_id) {
  try {
    const gameDevelopersIds = await getGameDevelopersIds(game_id);
    const developerNames = [];

    for (const gameDevelopersId of gameDevelopersIds) {
      const developerData = await getSingleDeveloper(
        gameDevelopersId.developer_id
      );
      developerNames.push(developerData[0].name);
    }

    return developerNames;
  } catch (error) {
    console.error("Error fetching game developers:", error);
    return [];
  }
}

async function getDeveloperGames(developer_id) {
  const { rows } = await pool.query(
    `SELECT * FROM game_developers WHERE developer_id = $1`,
    [developer_id]
  );
  const gameIds = rows.map((row) => row.game_id);

  const games = await Promise.all(
    gameIds.map(async (gameId) => {
      return await getSingleGame(gameId);
    })
  );
  return games;
}

async function getGenreGames(genre_id) {
  const { rows } = await pool.query(
    `SELECT * FROM game_genres WHERE genre_id = $1`,
    [genre_id]
  );
  const gameIds = rows.map((row) => row.game_id);

  const games = await Promise.all(
    gameIds.map(async (gameId) => {
      return await getSingleGame(gameId);
    })
  );
  return games;
}

async function addGenre(name) {
  const { rows } = await pool.query(
    `INSERT INTO genres (name) VALUES ($1) RETURNING *;`,
    [name]
  );
  return rows;
}

async function addDeveloper(name) {
  const { rows } = await pool.query(
    `INSERT INTO developers (name) VALUES ($1) RETURNING *;`,
    [name]
  );
  return rows;
}

async function addGame(name) {
  const { rows } = await pool.query(
    `INSERT INTO games (name) VALUES ($1) RETURNING *;`,
    [name]
  );
  return rows;
}

async function getLatestGameEntry() {
  const { rows } = await pool.query(`SELECT MAX(id) AS id FROM games;`);
  return rows;
}

async function linkGameToGenre(game_id, genre_id) {
  await pool.query(
    `INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2);`,
    [game_id, genre_id]
  );
}

async function linkGameToDeveloper(game_id, developer_id) {
  await pool.query(
    `INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2);`,
    [game_id, developer_id]
  );
}

async function editGameEntry(game_id, game_name, genres_id, developer_id) {
  await pool.query(`UPDATE games SET name = $1 WHERE id = $2;`, [
    game_name,
    game_id,
  ]);

  await pool.query(`DELETE FROM game_genres WHERE game_id = $1;`, [game_id]);

  for (const genre_id of genres_id) {
    await linkGameToGenre(game_id, genre_id);
  }

  await pool.query(
    `UPDATE game_developers SET developer_id = $1 WHERE game_id = $2;`,
    [developer_id, game_id]
  );
}

async function deleteGame(game_id) {
  await pool.query(`DELETE FROM game_genres WHERE game_id = $1;`, [game_id]);
  await pool.query(`DELETE FROM game_developers WHERE game_id = $1;`, [
    game_id,
  ]);
  await pool.query(`DELETE FROM games WHERE id = $1;`, [game_id]);
}

async function deleteDeveloper(developer_id) {
  await pool.query(`DELETE FROM game_developers WHERE developer_id = $1;`, [
    developer_id,
  ]);
  await pool.query(`DELETE FROM developers WHERE id = $1;`, [developer_id]);
}

async function deleteGenre(genre_id) {
  await pool.query(`DELETE FROM game_genres WHERE genre_id = $1;`, [genre_id]);
  await pool.query(`DELETE FROM genres WHERE id = $1;`, [genre_id]);
}

module.exports = {
  getGames,
  getSingleGame,
  getGameGenres,
  getGameDevelopers,
  getSingleGameByName,
  getGenres,
  getDevelopers,
  getDeveloperGames,
  getSingleDeveloperByName,
  getSingleGenreByName,
  getGenreGames,
  addGenre,
  addDeveloper,
  addGame,
  getLatestGameEntry,
  linkGameToGenre,
  linkGameToDeveloper,
  getGameGenresIds,
  getGameDevelopersIds,
  editGameEntry,
  deleteGame,
  deleteDeveloper,
  deleteGenre,
};
