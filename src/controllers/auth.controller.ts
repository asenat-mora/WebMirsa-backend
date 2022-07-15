import { NextFunction, Request, Response, Router } from "express";
import { createUser, getUserByEmail, getUserById } from "../repositories/user.repository";
import validationMiddleware from "../middlewares/validation.middleware";
import * as argon2 from "argon2";
import { signUpSchema, loginSchema, logoutSchema} from "../models/user.model";
import { generateJWTToken , generateRefreshToken } from "../services/jwt.service";
import { deleteRefreshToken, getInfoByRefreshToken } from "../repositories/refresh-token.repository";
import { insertRefreshToken } from "../repositories/refresh-token.repository";
import { ILoginUser, IUser } from "../interfaces/user.interface";


const router = Router();


router.post("/signUp", validationMiddleware(signUpSchema, "body") , async (req: Request, res: Response, next: NextFunction) => {
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

router.post("/login", validationMiddleware(loginSchema, "body") , async (req: Request, res: Response, next: NextFunction) => {
    const loginDetails = req.body as ILoginUser;

    try{
        const user = await getUserByEmail(loginDetails.email);

        if(!user) {
            res.status(404).json({
                message: "User with email "+ loginDetails.email +" not found"
            });
        }
        else{
            if(await argon2.verify(user.password, loginDetails.password)){
                const jwttoken = await generateJWTToken({userId: user.id, roles: user.roles.map(role => role.roleId)});
                const {token, expiresIn} = await generateRefreshToken({id: user.id});
                res.status(200).json({
                    accessToken: jwttoken,
                    refreshToken: token,
                });
                await insertRefreshToken(token, expiresIn, user.id);
            }
            else{
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }
    }catch(error) {
        console.log(error);
        next(error);
    }
}
);

router.post("/logout", validationMiddleware(logoutSchema, "body"),async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.refreshToken;
    try{
        await deleteRefreshToken(refreshToken);
        res.sendStatus(204);
    }catch(error){
        next(error);
    }
});

router.post("/refreshToken", async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.body.refreshToken;

    try{
        const info = await getInfoByRefreshToken(refreshToken);
        const user = await getUserById(info.userId);
        if(!user) {
            res.status(404).json({
                message: "User with refreshToken "+ refreshToken +" not found"
            });
        }else{
            
            const jwttoken = await generateJWTToken({userId: user.id, roles: user.roles.map(role => role.roleId)});
            res.status(200).json({
                accessToken: jwttoken,
            });
        }
    }catch(error){
        next(error);
    }
});


export default router;
