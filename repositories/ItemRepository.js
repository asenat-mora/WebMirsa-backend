const pool = require('../db/connection');

const addDetailsItem = (item, userId, description) => {
    return {
        ...item,
        id_last_user: userId,
        last_modification_description: description,
        last_modification_date: new Date()
    }
}

const createItem = async(item, userId, colors) => {
    var connection = await pool.getConnection();

    item = addDetailsItem(item, userId, "CREATED");

    try{
        await connection.promise().beginTransaction();
        const itemQuery = await connection.promise().query('INSERT INTO item SET ?', item);
        colors.forEach(color => {
            connection.promise().query('INSERT INTO ItemColor SET ?', {
                item_Id: itemQuery[0].insertId,
                color_Id: color
            });
        });

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
        query = await pool.query('SELECT id,name,description,price,image,side,model,code FROM item WHERE id = ? AND isDeleted = FALSE', id);
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
    const item = await pool.query('SELECT id,name,description,price,image,side,model,code FROM item WHERE id = ? AND isDeleted = FALSE', id);
    if(item.length === 0){
        return "Item with id = "+ id +" does not exist";
    }
    return item[0];
}

const getAllItems = async() => {
    const items = await pool.query('SELECT id,name,description,price,image,side,model,code FROM item WHERE isDeleted = FALSE');
    return items;
}

const deleteItem = async(id, userId) => {
    var connection = await pool.getConnection();
    item = addDetailsItem({
        isDeleted: true
    }, userId, "DELETED");
    try{

        var query = await pool.query('SELECT * FROM item WHERE id = ? and isDeleted = FALSE', id);
        if(query.length === 0){
            connection.release();
            return "Item with id = "+ id +" does not exist";
        }
        await connection.promise().query('UPDATE item SET ? WHERE id = ?', [item, id]);
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