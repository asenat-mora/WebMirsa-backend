import Joi from "joi";

const brandSchema = Joi.object({
    name: Joi.string().required()
});

export { brandSchema };