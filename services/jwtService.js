const jwt = require('jsonwebtoken');

const generateJWTToken = async(payload) => {
    return await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'  });
}

const generateRefreshToken = async(payload) => {
    return {
        token: await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }),
        expiresIn: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    }
}

module.exports = {
    generateJWTToken,
    generateRefreshToken
}
