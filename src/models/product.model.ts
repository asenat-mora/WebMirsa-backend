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

const queryProductSchema : Joi.Schema = Joi.object({
    brands: Joi.array().items(Joi.number()),
    accessories: Joi.array().items(Joi.number()),
    colors: Joi.array().items(Joi.number()),
    description: Joi.string(),
    side: Joi.string()
});

export { productSchema, queryProductSchema };
