const db = require("../db/queries");

async function indexRouterGet(req, res) {
  res.render("index");
}

module.exports = {
  indexRouterGet,
};
