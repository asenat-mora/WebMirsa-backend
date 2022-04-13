const router = require("express").Router();
const Joi = require("joi");
const argon2 = require('argon2');

const userRepository = require("../repositories/UserRepository");
const jwtService = require("../services/jwtService");
const refreshTokenRepository = require("../repositories/RefreshTokenRepository");
const validationMiddleware = require("../middlewares/validationMiddleware");

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

router.post("/login", validationMiddleware(loginSchema, "body"), async (req, res) => {
    const { email, password } = req.body;

    const user = await userRepository.getUserByEmail(email);
    
    if(!user){
        res.status(400).json({
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

router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;
    await refreshTokenRepository.deleteRefreshToken(refreshToken);
    res.sendStatus(204);
});




module.exports = router;
