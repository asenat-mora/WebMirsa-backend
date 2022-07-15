import { NextFunction, Request, Response, Router } from "express";
import { IBrand, IBrandEdit } from "../interfaces/brand.interface";
import { CustomRequest } from "../interfaces/request.interface";
import jwtRolesMiddleware from "../middlewares/jwt-roles.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import { brandSchema } from "../models/brand.model";
import Roles from "../models/roles.model";
import { createBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "../repositories/brand.repository";

const router = Router();

router.post("/", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), validationMiddleware(brandSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
    const brand = req.body as IBrand;
    try{
        const result = await createBrand(brand, (req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

router.patch("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), validationMiddleware(brandSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
    const brand : IBrandEdit = {name : req.body.name , id: Number(req.params.id)};
    try{
        const result = await updateBrand(brand, (req as CustomRequest).user!.userId);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
});

router.delete("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await deleteBrand(Number(req.params.id), (req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

router.get("/",  async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getAllBrands();
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

router.get("/:id", async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getBrandById(Number(req.params.id));
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

export default router;
