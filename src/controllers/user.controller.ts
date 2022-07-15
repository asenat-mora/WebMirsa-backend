import { NextFunction, Request, Response, Router } from "express";
import { getUserById } from "../repositories/user.repository";

const router = Router();


router.get("/:id", async(req: Request, res: Response, next: NextFunction) => {
    res.send(await getUserById(Number(req.params.id)));
});

export default router;