import Joi from "joi";

const accessorySchema : Joi.Schema = Joi.object({
    name: Joi.string().required()
});

export { accessorySchema };
