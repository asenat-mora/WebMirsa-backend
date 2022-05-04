const router = require("express").Router();
const Joi = require("joi");

const validationMiddleware = require("../middlewares/validationMiddleware");
const jwtRolesMiddleware = require("../middlewares/jwtRolesMiddleware");
const itemRepository = require("../repositories/itemRepository");
const ROLES_LIST = require("../config/roles");

const itemSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    colors: Joi.array().items(Joi.number()).required(),
    model: Joi.string().required(),
    side: Joi.string().required(),
});

router.post("/" , jwtRolesMiddleware([ROLES_LIST.Administrador]), validationMiddleware(itemSchema, "body"), async (req, res) => {
    const { name, description, price, image, colors, model, code, side } = req.body;
    const result = await itemRepository.createItem({
        name: name,
        description: description,
        code: code,
        price: price,
        image: image,
        //color: color,
        model: model,
        side: side
    }, req.user.userId, colors);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }else{
        res.sendStatus(204);
    }

});

router.patch("/:id" , jwtRolesMiddleware([ROLES_LIST.Administrador]), validationMiddleware(itemSchema, "body"), async (req, res) => {
    const { name, description, price, image, model ,code, side } = req.body;
    const result = await itemRepository.updateItem(req.params.id, {
        name: name,
        description: description,
        price: price,
        image: image,
        code: clave,
        //color: color,
        model: model,
        side: side
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
    const result = await itemRepository.deleteItem(req.params.id, req.user.userId);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }
    else{
        res.sendStatus(204);
    }

});

router.get("/:id" , async (req, res) => {
    const result = await itemRepository.getItemById(req.params.id);
    if(typeof result === "string"){
        res.status(404).json({
            message: result
        });
    }
    else{
        res.status(200).json(result);
    }

});

router.get("/" , async (req, res) => {
    const result = await itemRepository.getAllItems();
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }
    else{
        res.status(200).json(result);
    }
});

module.exports = router;
