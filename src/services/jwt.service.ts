import jwt from 'jsonwebtoken';

function generateJWTToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'JWTsecret', { expiresIn: '1h' });
}

function generateRefreshToken(payload:any) {
    return {
        token: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'refreshSecret', { expiresIn: '7d' }),
        expiresIn: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
    }
}

export { generateJWTToken, generateRefreshToken };

