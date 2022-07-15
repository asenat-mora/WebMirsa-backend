import Joi, { ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';

function validationMiddleware(schema: Joi.Schema, property:string){
    return (req: Request, res: Response, next: NextFunction) => {
        const result : Joi.ValidationResult = schema.validate(req[property as keyof Request]);
        if (!result.error) {
            next();
        }else{
            const error: ValidationError = result.error;
            const details = error.details.map(detail => detail.message).join(', ');
            res.status(400).json({message: details});
        }
        
    }
}

export default validationMiddleware;