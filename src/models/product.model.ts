import Joi from "joi";

const productSchema : Joi.Schema = Joi.object({
    sku: Joi.string().required(),
    code: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    colors: Joi.array().items(Joi.number()).required(),
    model: Joi.string().required(),
    side: Joi.string().required(),
    brandId: Joi.number().required(),
    accessoryId: Joi.number().required(),
});

export { productSchema };
