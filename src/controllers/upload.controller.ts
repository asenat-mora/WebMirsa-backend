import jwtRolesMiddleware from "../middlewares/jwt-roles.middleware";
import { NextFunction, Request, Response, Router } from "express";
import Roles from "../models/roles.model";
import multerMiddleware from "../middlewares/multer.middleware";
import { uploadFile } from "../services/upload.service";

const router = Router();

router.post("/", multerMiddleware.single('file'),/* jwtRolesMiddleware([Roles.Administrador, Roles.Capturista]), */ async (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!req.file){
            return res.status(400).json({message: "No file to upload"});
        }
        const result = await uploadFile(req.file);

        res.status(200).json({url: result});
    }catch(error){
        next(error);
    }
});

export default router;