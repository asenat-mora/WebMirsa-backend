const authController = require("../controllers/auth.controller");
const autopartController = require("../controllers/autopart.controller");
const brandController = require("../controllers/brand.controller");
const colorController = require("../controllers/color.controller");
const itemController = require("../controllers/item.controller");
const Router = require("express").Router();

const api = Router
    .use("/auth", authController)
    .use("/autopart", autopartController)
    .use("/brand", brandController)
    .use("/color", colorController)
    .use("/item", itemController)

module.exports = Router.use("/api", api);