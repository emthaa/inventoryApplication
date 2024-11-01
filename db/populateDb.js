const pool = require("./pool");

const createTables = async () => {
  try {
    const client = await pool.connect();

    await client.query("DROP TABLE IF EXISTS game_genres;");
    await client.query("DROP TABLE IF EXISTS game_developers;");
    await client.query("DROP TABLE IF EXISTS games;");
    await client.query("DROP TABLE IF EXISTS genres;");
    await client.query("DROP TABLE IF EXISTS developers;");

    const createGenresTable = `
      CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;
    await client.query(createGenresTable);

    const createGamesTable = `
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;
    await client.query(createGamesTable);

    const createDevelopersTable = `
      CREATE TABLE IF NOT EXISTS developers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;
    await client.query(createDevelopersTable);

    const createGameGenresTable = `
      CREATE TABLE IF NOT EXISTS game_genres (
        game_id INT REFERENCES games(id),
        genre_id INT REFERENCES genres(id),
        PRIMARY KEY (game_id, genre_id)
      );
    `;
    await client.query(createGameGenresTable);

    const createGameDevelopersTable = `
      CREATE TABLE IF NOT EXISTS game_developers (
        game_id INT REFERENCES games(id),
        developer_id INT REFERENCES developers(id),
        PRIMARY KEY (game_id, developer_id)
      );
    `;
    await client.query(createGameDevelopersTable);

    client.release();
    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables", err.stack);
  }
};

const insertData = async () => {
  try {
    const client = await pool.connect();

    const gameQuery = `
      INSERT INTO games (id, name)
      VALUES
        (1, 'Minecraft'),
        (2, 'Terraria'),
        (3, 'Persona 5'),
        (4, 'Fortnite'),
        (5, 'Red Dead Redemption 2'),
        (6, 'Payday 2')
      RETURNING *;
    `;
    const gameResult = await client.query(gameQuery);

    const genresQuery = `
      INSERT INTO genres (id, name)
      VALUES
        (1, 'Sandbox'),
        (2, 'Action'),
        (3, 'Adventure'),
        (4, 'RPG (Role-playing)'),
        (5, 'Shooter'),
        (6, 'Open World'),
        (7, 'Stealth'),
        (8, 'Battle Royale')
      RETURNING *;
    `;
    const genresResult = await client.query(genresQuery);

    const developersQuery = `
      INSERT INTO developers (id, name)
      VALUES
        (1, 'Mojang'),
        (2, 'Re-Logic'),
        (3, 'Atlus'),
        (4, 'Epic Games'),
        (5, 'Rockstar Games'),
        (6, 'Overkill Software')
      RETURNING *;
    `;
    const developersResult = await client.query(developersQuery);

    const gameGenresQuery = `
      INSERT INTO game_genres (game_id, genre_id)
      VALUES
        (1, 1), (1, 2),
        (2, 2), (2, 3),
        (3, 4),
        (4, 5), (4, 8),
        (5, 2), (5, 6),
        (6, 5), (6, 7)
      RETURNING *;
    `;
    const gameGenresResult = await client.query(gameGenresQuery);

    const gameDevelopersQuery = `
      INSERT INTO game_developers (game_id, developer_id)
      VALUES
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6)
      RETURNING *;
    `;
    const gameDevelopersResult = await client.query(gameDevelopersQuery);

    client.release();
    console.log("Data inserted successfully!");
  } catch (err) {
    console.error("Error executing query", err.stack);
  }
};

createTables().then(() => {
  insertData();
});
