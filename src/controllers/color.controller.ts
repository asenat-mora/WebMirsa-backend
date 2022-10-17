import { NextFunction, Request, Response, Router } from "express";
import { createColor, deleteColor, getAllColors, getColorById, updateColor } from "../repositories/color.repository";
import { IColor, IColorEdit } from "../interfaces/color.interface";
import jwtRolesMiddleware from "../middlewares/jwt-roles.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import { colorSchema } from "../models/color.model";
import Roles from "../models/roles.model";
import { CustomRequest } from "../interfaces/request.interface";


const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllColors();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getColorById(Number(req.params.id));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


router.post("/", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]) , validationMiddleware(colorSchema, "body") ,async(req: Request, res: Response, next: NextFunction) => {
    const color = req.body as IColor;
    try{
        const result = await createColor(color ,(req as CustomRequest).user!.userId);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

router.patch("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]) , validationMiddleware(colorSchema, "body") ,async(req: Request, res: Response, next: NextFunction) => {
    const color: IColorEdit = {name : req.body.name , id: Number(req.params.id)};
    try{
        const result = await updateColor(color, (req as CustomRequest).user!.userId);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
});

router.delete("/:id", jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]) , async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await deleteColor(Number(req.params.id));
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

export default router;
