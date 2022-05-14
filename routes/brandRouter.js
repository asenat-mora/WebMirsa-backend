const router = require("express").Router();
const Joi = require("joi");

const validationMiddleware = require("../middlewares/validationMiddleware");
const jwtRolesMiddleware = require("../middlewares/jwtRolesMiddleware");
const brandRepository = require("../repositories/brandRepository");
const ROLES_LIST = require("../config/roles");

//Objeto que contiene los campos que se van a validar
const brandSchema = Joi.object({
    name: Joi.string().required()
});

router.post("/" , jwtRolesMiddleware([ROLES_LIST.Administrador]), validationMiddleware(brandSchema, "body"), async (req, res) => {
    const { name } = req.body;
    const result = await brandRepository.createBrand({
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

router.patch("/:id" , jwtRolesMiddleware([ROLES_LIST.Administrador]), validationMiddleware(brandSchema, "body"), async (req, res) => {
    const { name } = req.body;
    const result = await brandRepository.updateBrand(req.params.id, {
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

router.delete("/:id" , jwtRolesMiddleware([ROLES_LIST.Administrador]), async (req, res) => {
    const result = await brandRepository.deleteBrand(req.params.id, req.user.userId);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }else{
        res.sendStatus(204);
    }
});

router.get("/" , async (req, res) => {
    res.status(200).json(await brandRepository.getAllBrands());
});

router.get("/:id"  , async (req, res) => {
    const result = await brandRepository.getBrandById(req.params.id);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }else{
        res.status(200).json(result);
    }

});

module.exports = router;





