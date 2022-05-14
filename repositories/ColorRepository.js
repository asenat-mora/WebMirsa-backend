const pool = require('../db/connection');

const getAllColors = async () => {
    return await pool.query('SELECT * FROM color');
}

module.exports = {
    getAllColors
}
