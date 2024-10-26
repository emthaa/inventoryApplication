
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//----------------------------------------

const indexRouter = require("./routes/indexRouter");
const gamesRouter = require("./routes/gamesRouter");
const genresRouter = require("./routes/genresRouter");
const developersRouter = require("./routes/developersRouter");


app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/", gamesRouter);
app.use("/", genresRouter);
app.use("/", developersRouter);

const PORT = 8000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));