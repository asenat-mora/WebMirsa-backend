const jwt = require('jsonwebtoken');

const jwtRolesMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({message: 'No token provided.' });
        }
        jwt.verify(token, process.env.JWT_SECRET , (err, decoded) => {
            if (err) {
                return res.status(500).send({  message: 'Failed to authenticate token.' });
            }
            const user = decoded;
            if(!allowedRoles.lenght === 0){
                const result = user.roles.map(role => allowedRoles.includes(role)).find(result => result === true);
                if(!result) return res.status(403).send({message: 'Not allowed to access this resource' });
            }
            req.user = user;
            next();
        });
    };
}

module.exports = jwtRolesMiddleware;