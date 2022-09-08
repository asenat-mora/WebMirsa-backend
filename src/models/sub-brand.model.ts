import Joi from "joi";

const subBrandSchema = Joi.object({
    name: Joi.string().required(),
    brandId: Joi.number().required(),
});

export { subBrandSchema };