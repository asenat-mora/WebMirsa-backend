const router = require("express").Router();

const colorRepository = require("../repositories/color.repository");

router.get("/", async(req, res) => {
    res.status(200).json(await colorRepository.getAllColors());
});

module.exports = router;