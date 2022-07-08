const router = require("express").Router();
const Joi = require("joi");
const argon2 = require('argon2');

const userRepository = require("../repositories/user.repository");
const jwtService = require("../services/jwt.service");
const refreshTokenRepository = require("../repositories/refresh-token.repository");
const validationMiddleware = require("../middlewares/validation.middleware");


const signUpSchema = Joi.object({
	name: Joi.string().required(),
	surname: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	verificationEmail: Joi.string().email().required(),
    roles: Joi.array().items(Joi.number()).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


/* end-point registro */
router.post("/signUp", validationMiddleware(signUpSchema, "body"), async (req, res) => {
	const { name, surname, email, password, verificationEmail, roles } = req.body;
    
    const hashedPassword = await argon2.hash(password);

    
		const result = await userRepository.createUser(
			{
				name : name,
				surname : surname,
				email : email,
				password: hashedPassword,
				verificationEmail: verificationEmail,
			},
            roles
		);
        if(typeof result === "string"){
            res.status(400).json({
                message: result
            });
        }else{
            res.sendStatus(204);
        }	
	
});
/* end-point login */
router.post("/login", validationMiddleware(loginSchema, "body"), async (req, res) => {
    const { email, password } = req.body;

    const user = await userRepository.getUserByEmail(email);
    
    if(!user){
        res.status(404).json({
            message: "User with email "+ email +" not found"
        });
    }else{
        const {id , roles} = user;
        const isValid = await argon2.verify(user.password, password);
        if(!isValid){
            res.status(400).json({
                message: "Invalid password"
            });
        }else{
            const jwttoken = await jwtService.generateJWTToken({userId: id, roles: roles});
            const {token, expiresIn} = await jwtService.generateRefreshToken({id: id});
            await refreshTokenRepository.insertRefreshToken(token, user.id , expiresIn);
            res.status(200).json({
                accessToken: jwttoken,
                refreshToken: token,
            });
        }
    }
});
/* end-point cerrar sesion */
router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;
    await refreshTokenRepository.deleteRefreshToken(refreshToken);
    res.sendStatus(204);
});

router.post("/refreshToken", async (req, res) => {
    const { refreshToken } = req.body;
    const user = await refreshTokenRepository.getUserByRefreshToken(refreshToken);
    if(!user){
        res.status(404).json({
            message: "User with refresh token "+ refreshToken +" not found"
        });
    }else{
        const {id , roles} = user;
        const jwttoken = await jwtService.generateJWTToken({userId: id, roles: roles});
        res.status(200).json({
            accessToken: jwttoken,
        });
    }
});


module.exports = router;