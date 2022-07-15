import Joi from "Joi";

const signUpSchema : Joi.Schema = Joi.object({
	name: Joi.string().required(),
	surname: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	verificationEmail: Joi.string().email().required(),
    roles: Joi.array().items(Joi.number()).required(),
});

const loginSchema : Joi.Schema =  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const logoutSchema : Joi.Schema = Joi.object({
    refreshToken: Joi.string().required(),
});

export { signUpSchema, loginSchema, logoutSchema };
