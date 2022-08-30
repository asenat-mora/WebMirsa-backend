import { NextFunction, Request, Response, Router } from "express";
import { getAllUsers, getUserById, updateUser } from "../repositories/user.repository";
import validationMiddleware from "../middlewares/validation.middleware";
import { editUserSchema, signUpSchema} from "../models/user.model";
import * as argon2 from "argon2";
import { IUser } from "../interfaces/user.interface";
import { createUser } from "../repositories/user.repository";
import jwtRolesMiddleware from "../middlewares/jwt-roles.middleware";
import Roles from "../models/roles.model";
import { CustomRequest } from "../interfaces/request.interface";

const router = Router();

router.post("/signUp", validationMiddleware(signUpSchema, "body") , jwtRolesMiddleware([Roles.Administrador]), async (req: Request, res: Response, next: NextFunction) => {
    const roles = req.body.roles as Array<number>; 
    delete req.body.roles;
    let userBody: IUser = req.body as IUser;

    userBody.password = await argon2.hash(userBody.password);

    try{
        const user = await createUser(userBody, roles);
        res.sendStatus(204);
    }catch(error: any) {
        next(error);
    }

});

router.patch("/:id", validationMiddleware(editUserSchema, "body"), jwtRolesMiddleware([Roles.Administrador]), async(req: Request, res: Response, next: NextFunction) => {
    const roles = req.body.roles as Array<number>; 
    delete req.body.roles;
    const user : IUser = req.body as IUser;

    user.password = await argon2.hash(user.password);

    try{
        const result = await updateUser(user, roles, parseInt(req.params.id) );
        res.status(200).json(result);
    }catch(error: any){
        next(error);
    }
    
});

router.get("/:id", jwtRolesMiddleware([Roles.Administrador]), async(req: Request, res: Response, next: NextFunction) => {
    res.send(await getUserById(Number(req.params.id)));
});

router.get("/", jwtRolesMiddleware([Roles.Administrador]), async(req: Request, res: Response, next: NextFunction) => {
    res.send(await getAllUsers());
});

export default router;