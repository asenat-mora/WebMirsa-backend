import Joi from "joi";

const colorSchema : Joi.Schema = Joi.object({
    name: Joi.string().required()
});

export { colorSchema };