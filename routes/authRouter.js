const router = require("express").Router();
const Joi = require("joi");

const repository = require("../repositories/UserRepository");
const validationMiddleware = require("../middlewares/validationMiddleware");

const schema = Joi.object({
	name: Joi.string().required(),
	surname: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	verificationEmail: Joi.string().email().required(),
});


router.post("/", validationMiddleware(schema, "body"), async (req, res) => {
	const { name, surname, email, password, verificationEmail } = req.body;
	try {
		const result = await repository.createUser(
			{
				name : name,
				surname : surname,
				email : email,
				password: password,
				verificationEmail: verificationEmail,
			}
		);
        console.log(result);
		res.sendStatus(204);
	} catch (error) {
        if(error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({
                message: "Email is already in use"
            });
        }
	}
});

module.exports = router;
