const pool = require('../db/connection');

const addDetailsItem = (item, userId, description) => {
    return {
        ...item,
        id_last_user: userId,
        last_modification_description: description,
        last_modification_date: new Date()
    }
}

const createItem = async(item, userId) => {
    var connection = await pool.getConnection();

    item = addDetailsItem(item, userId, "CREATED");

    try{
        await connection.promise().beginTransaction();
        const itemQuery = await connection.promise().query('INSERT INTO item SET ?', item);

        connection.promise().commit()
        connection.release();
    }catch(err){
        connection.rollback();
        connection.release();
        if(err.code === 'ER_DUP_ENTRY') {
            return "Product is already on the db";
        }else if(err.code === 'ER_NO_REFERENCED_ROW_2'){
            return "User with id " + userId[i]+ " does not exist";
        }
    }

}

const updateItem = async(id, item, userId) => {

    var connection = await pool.getConnection();
    item = addDetailsItem(item, userId, "UPDATED");

    try{
        var query = await pool.query('SELECT * FROM item WHERE id = ?', id);
        if(query.length === 0){
            connection.release();
            return "Item with id = "+ id +" does not exist";
        }
        await connection.promise().query('UPDATE item SET ? WHERE id = ?', [item, id]);
        query = await pool.query('SELECT id,name,description,price,image,color, model FROM item WHERE id = ?', id);
        connection.release();
        return query[0];
    }catch(err){
        connection.release();
        if(err.code === 'ER_DUP_ENTRY') {
            return "Product is already on the db";
        }else if(err.code === 'ER_NO_REFERENCED_ROW_2'){
            return "User with id " + userId[i]+ " does not exist";
        }
        console.log(err)
    }
}

const getItemById = async(id) => {
    const item = await pool.query('SELECT id,name,description,price,image,color, model  FROM item WHERE id = ?', id);
    if(item.length === 0){
        return "Item with id = "+ id +" does not exist";
    }
    return item[0];
}

const getAllItems = async() => {
    const items = await pool.query('SELECT id,name,description,price,image,color, model  FROM item');
    return items;
}

const deleteItem = async(id) => {
    var connection = await pool.getConnection();
    try{
        var query = await pool.query('SELECT * FROM item WHERE id = ?', id);
        if(query.length === 0){
            connection.release();
            return "Item with id = "+ id +" does not exist";
        }
        await connection.promise().query('DELETE FROM item WHERE id = ?', id);
        connection.release();
    }catch(err){
        connection.release();
        console.log(err)
    }
}

module.exports = {
    createItem,
    updateItem,
    getItemById,
    getAllItems,
    deleteItem
}