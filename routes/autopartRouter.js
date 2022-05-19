const router = require("express").Router();
const Joi = require("joi");

const validationMiddleware = require("../middlewares/validationMiddleware");
const jwtRolesMiddleware = require("../middlewares/jwtRolesMiddleware");
const autoPartRepository = require("../repositories/AutopartRepository");
const ROLES_LIST = require("../config/roles");
const res = require("express/lib/response");

//Objeto que contiene los campos que se van a validar
const autoPartSchema = Joi.object({
    name: Joi.string().required()
});


router.post("/" , jwtRolesMiddleware([ROLES_LIST.Administrador, ROLES_LIST.Capturista]), validationMiddleware(autoPartSchema, "body"), async (req, res) => {
    const { name } = req.body;
    const result = await autoPartRepository.createAutopart({
        name :name
    }, req.user.userId);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }else{
        res.sendStatus(204);
    }
});

router.patch("/:id" , jwtRolesMiddleware([ROLES_LIST.Administrador, ROLES_LIST.Capturista]), validationMiddleware(autoPartSchema, "body"), async (req, res) => {
    const { name } = req.body;
    const result = await autoPartRepository.updateAutopart(req.params.id, {
        name :name
    }, req.user.userId);

    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }
    else{
        res.status(200).json(result);
    }
});

router.delete("/:id" , jwtRolesMiddleware([ROLES_LIST.Administrador, ROLES_LIST.Capturista]), async (req, res) => {
    const result = await autoPartRepository.deleteAutopart(req.params.id, req.user.userId);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }
    else{
        res.sendStatus(204);
    }
});

router.get("/" , async (req, res) => {
    res.status(200).json(await autoPartRepository.getAllAutoparts());
});

router.get("/:id"  , async (req, res) => {
    const result = await autoPartRepository.getAutopartById(req.params.id);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }else{
        res.status(200).json(result);
    }
});

module.exports = router;

