import Joi from "Joi";

const accessorySchema : Joi.Schema = Joi.object({
    name: Joi.string().required()
});

export { accessorySchema };
