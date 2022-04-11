const router = require("express").Router();
const Joi = require("joi");

const repository = require("../repositories/UserRepository");
const validationMiddleware = require("../middlewares/validationMiddleware");

const updateSchema = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().email().required(),
    verificationEmail: Joi.string().email().required(),
});

router.put("/:id", validationMiddleware(updateSchema, "body"), async (req, res) => {
    const { id } = req.params;
    const { name, surname, email, verificationEmail } = req.body;
    const result = await repository.updateUser(id, 
        {
            name,
            surname,
            email,
            verificationEmail,
        }
    );

    if(typeof result === "string"){
        res.status(400).json({
            message: result
        });
    }else{
        res.status(200).json(result);
    }
});

module.exports = router;