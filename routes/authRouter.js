const router = require("express").Router();
const Joi = require("joi");
const { Prisma } = require("@prisma/client");

const repository = require("../repositories/UserRepository");
const validationMiddleware = require("../middlewares/validationMiddleware");

const schema = Joi.object({
	name: Joi.string().required(),
	surname: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	verificationEmail: Joi.string().email().required(),
});

router.get("/", async (req, res) => {
	//const  users = await repository.findAllUsers();
	const users = await repository.findUserById(2);
	if (!users) {
		console.log(users);
	}
	res.json(users);
});

router.post("/", validationMiddleware(schema, "body"), async (req, res) => {
	const { name, surname, email, password, verificationEmail } = req.body;
	try {
		const user = await repository.createUser({
			data: {
				name,
				surname,
				email,
				password,
				verificationEmail,
			},
		});
		res.json(user);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				res.status(400).json({ error: "Email already exists" });
				console.log("already exists");
			}
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
});

module.exports = router;
