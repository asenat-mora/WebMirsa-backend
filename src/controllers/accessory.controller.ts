import { NextFunction, Request, Response, Router } from "express";
import { IAccessory, IAccessoryEdit } from "../interfaces/accessory.interface";
import { CustomRequest } from "../interfaces/request.interface";
import jwtRolesMiddleware from "../middlewares/jwt-roles.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import { accessorySchema} from "../models/accessory.model";
import Roles from "../models/roles.model";
import { createAccessory, deleteAccessory, getAccessoryById, getAllAccessories, updateAccessory } from "../repositories/accessory.repository";

const router = Router();

router.post("/", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]) , validationMiddleware(accessorySchema, "body") ,async(req: Request, res: Response, next: NextFunction) => {
    const accessory = req.body as IAccessory;
    try{
        const result = await createAccessory(accessory, (req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
} );

router.patch("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]) , validationMiddleware(accessorySchema, "body") ,async(req: Request, res: Response, next: NextFunction) => {
    const accessory: IAccessoryEdit = {name : req.body.name , id: Number(req.params.id)};

    try{
        const result = await updateAccessory(accessory, (req as CustomRequest).user!.userId);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
});

router.delete("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]) , async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await deleteAccessory(Number(req.params.id), (req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

router.get("/",  async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getAllAccessories();
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

router.get("/:id", async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await getAccessoryById(Number(req.params.id));
        res.status(200).json(result);
    } catch(error){
        next(error);
    }
});

export default router;