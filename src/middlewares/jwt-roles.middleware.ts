import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest, IJwtPayload } from '../interfaces/request.interface';


function jwtRolesMiddleware (allowedRoles: Array<number>) {
    return (req:Request, res:Response, next: NextFunction) => {
        const token: string | undefined = req.headers.authorization;
        if (!token) {
            return res.status(401).send({message: 'No token provided.' });
        }
        jwt.verify(token, process.env.JWT_SECRET || 'JWTsecret' , (err, decoded) => {
            if (err) {
                return res.status(500).send({  message: 'Failed to authenticate token.' });
            }
            const user = decoded as IJwtPayload;
            if(!(allowedRoles.length == 0)){
                const result = user.roles.map(role => allowedRoles.includes(role)).find(result => result === true);
                if(!result) return res.status(403).send({message: 'Not allowed to access this resource' });
            }
            (req as CustomRequest).user = user;
            next();
        });
    };
}

export default jwtRolesMiddleware;

