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
        if(query[0].length === 0){
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
    if(user[0].length === 0){
        return "User with id = "+ id +" does not exist";
    }
    return user[0];
};

const getUserByEmail = async(email) => {
    const user = await pool.query('SELECT * FROM user WHERE email = ?', email);
    return user[0];
};

/*
const findUserById = async(id) => {
    return await prisma.user.findUnique({
        where: {id}, 
        select:{
            id: true,
            name: true,
            surname: true,
            email: true,
        }
        });
}

const findAllUsers = async() => {
    return await prisma.user.findMany({
        select:{
            id: true,
            name: true,
            surname: true,
            email: true,
            verificationEmail: true,
        }
    });
}

const updateUser = async(id, user) => {
    return await prisma.user.update({
        where: {id},
        data: user,
        select:{
            id: true,
            name: true,
            surname: true,
            email: true,
            verificationEmail: true,
        }
    });
}

const deleteUser = async(id) => {
    return await prisma.user.delete({where: {id}});
}
*/
module.exports = {
    createUser,
    updateUser,
    getUserById,
    getUserByEmail,
    /*
    findUserById,
    findAllUsers,
    updateUser,
    deleteUser*/
}