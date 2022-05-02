const router = require("express").Router();
const Joi = require("joi");

const validationMiddleware = require("../middlewares/validationMiddleware");
const jwtRolesMiddleware = require("../middlewares/jwtRolesMiddleware");
const itemRepository = require("../repositories/itemRepository");

const itemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    color: Joi.string().required(),
    model: Joi.string().required(),
});

router.post("/" , jwtRolesMiddleware(["admin"]), validationMiddleware(itemSchema, "body"), async (req, res) => {
    const { name, description, price, image, color, model } = req.body;
    const result = await itemRepository.createItem({
        name: name,
        description: description,
        price: price,
        image: image,
        color: color,
        model: model,
    }, req.user.userId);
    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }else{
        res.sendStatus(204);
    }

});

router.patch("/:id" , jwtRolesMiddleware(["admin"]), validationMiddleware(itemSchema, "body"), async (req, res) => {
    const { name, description, price, image, color, model } = req.body;
    const result = await itemRepository.updateItem(req.params.id, {
        name: name,
        description: description,
        price: price,
        image: image,
        color: color,
        model: model,
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

router.delete("/:id" , jwtRolesMiddleware(["admin"]), async (req, res) => {
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
