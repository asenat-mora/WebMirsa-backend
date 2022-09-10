import { Router } from 'express';
import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller';
import accessoryController from '../controllers/accessory.controller';
import colorController from '../controllers/color.controller';
import brandController from '../controllers/brand.controller';
import productController from '../controllers/product.controller';
import subBrandController from '../controllers/sub-brand.controller';

const api = Router()
    .use('/users', userController)
    .use('/auth', authController)
    .use('/accessory', accessoryController)
    .use('/color', colorController)
    .use('/brand', brandController)
    .use('/product', productController)
    .use('/sub-brand', subBrandController);

export default Router().use("/api", api);
