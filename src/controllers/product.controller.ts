import { NextFunction, Request, Response, Router } from "express";
import { IProduct } from "../interfaces/product.interface";
import { CustomRequest } from "../interfaces/request.interface";
import jwtRolesMiddleware from "../middlewares/jwt-roles.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import { productSchema } from "../models/product.model";
import Roles from "../models/roles.model";
import { createProduct, deleteProduct, getAllProducts, getProductByCode, getProductById, updateProduct } from "../repositories/product.repository";

const router = Router();

router.post("/", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), validationMiddleware(productSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
    const product : IProduct = {sku: req.body.sku, description: req.body.description, price: req.body.price, image: req.body.image, model: req.body.model, side: req.body.side, code: req.body.code};
    try{
        const result = await createProduct(product, req.body.accessoryId , req.body.brandId, req.body.colors,(req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }
    catch(error){
        next(error);
    }
});

router.patch("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), validationMiddleware(productSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
    const product : IProduct = {sku: req.body.sku, description: req.body.description, price: req.body.price, image: req.body.image, model: req.body.model, side: req.body.side, code: req.body.code};
    try{
        const result = await updateProduct(product, Number(req.params.id), req.body.accessoryId , req.body.brandId, req.body.colors,(req as CustomRequest).user!.userId);
        res.status(200).json(result);
    }
    catch(error){
        next(error);
    }
});

router.delete("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await deleteProduct(Number(req.params.id), (req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }
    catch(error){
        next(error);
    }
});

router.get("/",  async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getAllProducts();
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

router.get("/:id", async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getProductById(Number(req.params.id));
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

router.get("/code/:id", async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getProductByCode(req.params.id);
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

export default router;
