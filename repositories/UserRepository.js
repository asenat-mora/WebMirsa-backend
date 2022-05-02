const pool = require('../db/connection');

const createUser = async(user, roles) => {
    
    var connection = await pool.getConnection();
    try{
        await connection.promise().beginTransaction();

        const userQuery = await connection.promise().query('INSERT INTO user SET ?', user);
        for (var i = 0; i < roles.length; i++) {
            await connection.promise().query('INSERT INTO userRoles SET ?', {
                userId: userQuery[0].insertId,
                roleId: roles[i]
            });
        }
        connection.promise().commit();
        connection.release();

    }catch(err){
        connection.rollback();
        connection.release();
        if(err.code === 'ER_DUP_ENTRY') {
            return "Email is already in use";
        }else if(err.code === 'ER_NO_REFERENCED_ROW_2'){
            return "Role " + roles[i]+ " does not exist";
        }
        console.log(err)
    }
    
    
}


const updateUser = async(id,user) => {
    var connection = await pool.getConnection();
    try{
        var query = await pool.query('SELECT * FROM user WHERE id = ?', id);
        if(query.length === 0){
            connection.release();
            return "User with id = "+ id +" does not exist";
        }
        await connection.promise().query('UPDATE user SET ? WHERE id = ?', [user, id]);
        query = await pool.query('SELECT id,name,surname,email,verificationEmail FROM user WHERE id = ?', id);
        connection.release();
        return query[0];
    }catch(err){
        connection.release();
        if(err.code === 'ER_DUP_ENTRY') {
            return "Email is already in use";
        }
    console.log(err)
    }
}

const getUserById = async(id) => {
    const user = await pool.query('SELECT id,name,surname,email,verificationEmail FROM user WHERE id = ?', id);
    if(user.length === 0){
        return "User with id = "+ id +" does not exist";
    }
    return user[0];
};

const getUserByEmail = async(email) => {
    const user = await pool.query('SELECT * FROM user WHERE email = ?', email);
    if(user.length === 0){
        return;
    }else{
        const rolesQuery = await pool.query('SELECT roleId FROM userRoles WHERE userId = ?', user[0].id);
        user[0].roles = [];
        rolesQuery.map(role => {
            user[0].roles.push(role.roleId);
        });
        return user[0];
    }
    
};


module.exports = {
    createUser,
    updateUser,
    getUserById,
    getUserByEmail,
}