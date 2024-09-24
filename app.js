
const express = require("express");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//----------------------------------------

const indexRouter = require("./routes/indexRouter"); //gets router
const gamesRouter = require("./routes/gamesRouter");
const genresRouter = require("./routes/genresRouter");
const developersRouter = require("./routes/developersRouter");


app.use(express.urlencoded({ extended: true })); //req.body encoder

app.use("/", indexRouter); //mounts router at /
app.use("/", gamesRouter);
app.use("/", genresRouter);
app.use("/", developersRouter);

const PORT = 8000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));