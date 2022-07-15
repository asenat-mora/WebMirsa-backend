import {Request} from "express";


interface IJwtPayload {
    userId: number,
    roles: Array<number>
}

interface CustomRequest extends Request {
    user?: IJwtPayload
}

export { CustomRequest, IJwtPayload };