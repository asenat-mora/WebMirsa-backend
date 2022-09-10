import { NextFunction, Request, Response, Router } from "express";
import { ISubBrand } from "../interfaces/sub-brand.interface";
import { CustomRequest } from "../interfaces/request.interface";
import jwtRolesMiddleware from "../middlewares/jwt-roles.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import { subBrandSchema } from "../models/sub-brand.model";
import Roles from "../models/roles.model";
import { createSubBrand, deleteSubBrand, getAllSubBrands, getSubBrandsByBrandId } from "../repositories/sub-brand.repository";

const router = Router();

router.post("/", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), validationMiddleware(subBrandSchema, "body"), async (req: Request, res: Response, next: NextFunction) => {
    const subBrand = req.body as ISubBrand;
    try{
        const result = await createSubBrand(subBrand, (req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

router.delete("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await deleteSubBrand(Number(req.params.id), (req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

router.get("/",  async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getAllSubBrands();
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

router.get("/brand/:id", async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getSubBrandsByBrandId(Number(req.params.id));
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

export default router;
