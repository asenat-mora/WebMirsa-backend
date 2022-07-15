import { NextFunction, Request, Response, Router } from "express";
import { getAllColors } from "../repositories/color.repository";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllColors();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
