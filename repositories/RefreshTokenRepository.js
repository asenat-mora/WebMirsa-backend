const pool = require('../db/connection');
/* insertar token de refresco */
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
/* eliminar token de refresco */
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
