const pool = require('../db/connection');

const insertRefreshToken = async(refreshToken, userId, expiresIn) => {
    try{
        await pool.query('INSERT INTO refreshToken SET ?', {
            token: refreshToken,
            userId: userId,
            expirationDate: expiresIn
        });
    }catch(err){
        console.log(err)
    }
}

const deleteRefreshToken = async(refreshToken) => {
    try{
        await pool.query('DELETE FROM refreshToken WHERE token = ?', refreshToken);
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    insertRefreshToken,
    deleteRefreshToken
}
