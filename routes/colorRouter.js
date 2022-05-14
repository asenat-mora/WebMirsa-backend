const router = require("express").Router();

const colorRepository = require("../repositories/colorRepository");

router.get("/", async(req, res) => {
    res.status(200).json(await colorRepository.getAllColors());
});

module.exports = router;
