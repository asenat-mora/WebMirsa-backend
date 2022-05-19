const pool = require('../db/connection');
const modifyAttributes = require('../utils/mapOutputs').modifyAttributes;


const addDetailsItem = (autoPart, userId, description) => {
    return {
        ...autoPart,
        id_last_user: userId,
        last_modification_description: description,
        last_modification_date: new Date()
    }
}

const createAutopart = async(autoPart, userId) => {

    autoPart = addDetailsItem(autoPart, userId, "CREATED");

    try{
        await pool.query('INSERT INTO autopart SET ?', autoPart);

    }catch(err){
        if(err.code === 'ER_DUP_ENTRY') {
            return "Autopart is already on the db";
        }else if(err.code = 'ER_NO_REFERENCED_ROW_2'){
            return "User with id " + userId + " does not exist";
        }
    }
}

const updateAutopart = async(id, autoPart, userId) => {
    
    autoPart = addDetailsItem(autoPart, userId, "UPDATED");

    try{
        var query = await pool.query('SELECT * FROM autopart WHERE id = ? and isDeleted = FALSE', id);
        if(query.length === 0){
            return "AutoPart with id = "+ id +" does not exist";
        }

        await pool.query('UPDATE autopart SET ? WHERE id = ?', [autoPart, id]);
        return await getAutopartById(id);
    }catch(err){
        if(err.code === 'ER_DUP_ENTRY') {
            return "The AutoPart with name:" + autoPart.name + "is already on the db";
        }else if(err.code = 'ER_NO_REFERENCED_ROW_2'){
            return "User with id " + userId + " does not exist";
        }
    }
}

const deleteAutopart = async(id, userId) => {
    autoPart = addDetailsItem({
        isDeleted: true
    }, userId, "DELETED");

    try{
        var query = await pool.query('SELECT * FROM autopart WHERE id = ? and isDeleted = FALSE', id);
        if(query.length === 0){
            return "Brand with id = "+ id +" does not exist";
        }
        await pool.query('UPDATE autopart SET ? WHERE id = ?', [autoPart, id]);
    }
    catch(err){
        console.log(err);   
    }
}

const getAllAutoparts = async() => {
    try{/* SELECT * FROM autopart WHERE isDeleted = FALSE */
        var autoParts = await pool.query('SELECT A.id as autopartId, A.name as autopartName, U.name as userName, U.surname as userSurname ,A.last_modification_description, A.last_modification_date, A.isDeleted FROM autopart as A JOIN User as U ON A.id_last_user = U.id WHERE A.isDeleted = 0');
        return modifyAttributes(autoParts);
    }
    catch(err){
        console.log(err);
    }
}

const getAutopartById = async(id) => {
    try{
        var autoPart = await pool.query('SELECT * FROM autopart WHERE id = ? and isDeleted = FALSE', id);
        if(autoPart.length === 0){
            return "AutoPart with id = "+ id +" does not exist";
        }
        return autoPart[0];
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    createAutopart,
    updateAutopart,
    deleteAutopart,
    getAllAutoparts,
    getAutopartById
}