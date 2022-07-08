const pool = require('../db/connection');
const modifyAttributes = require("../utils/map-outputs.utils").modifyAttributes;


const addDetailsItem = (brand, userId, description) => {
    return {
        ...brand,
        id_last_user: userId,
        last_modification_description: description,
        last_modification_date: new Date()
    }
}

const createBrand = async(brand, userId) => {

    brand = addDetailsItem(brand, userId, "CREATED");

    try{
        await pool.query('INSERT INTO brand SET ?', brand);

    }catch(err){
        if(err.code === 'ER_DUP_ENTRY') {
            return "Brand is already on the db";
        }else if(err.code = 'ER_NO_REFERENCED_ROW_2'){
            return "User with id " + userId + " does not exist";
        }
    }
}

const updateBrand = async(id, brand, userId) => {
    
    brand = addDetailsItem(brand, userId, "UPDATED");

    try{
        var query = await pool.query('SELECT * FROM brand WHERE id = ? and isDeleted = FALSE', id);
        if(query.length === 0){
            return "Brand with id = "+ id +" does not exist";
        }

        await pool.query('UPDATE brand SET ? WHERE id = ?', [brand, id]);

        return await getBrandById(id);
    }catch(err){
        if(err.code === 'ER_DUP_ENTRY') {
            return "The brand with name:" + brand.name + "is already on the db";
        }else if(err.code = 'ER_NO_REFERENCED_ROW_2'){
            return "User with id " + userId + " does not exist";
        }
    }
}

const deleteBrand = async(id, userId) => {
    brand = addDetailsItem({
        isDeleted: true
    }, userId, "DELETED");

    try{
        var query = await pool.query('SELECT * FROM brand WHERE id = ? and isDeleted = FALSE', id);
        if(query.length === 0){
            return "Brand with id = "+ id +" does not exist";
        }
        await pool.query('UPDATE brand SET ? WHERE id = ?', [brand, id]);
    }
    catch(err){
        console.log(err);
    }

}

const getAllBrands = async() => {
    try{/* SELECT * FROM brand WHERE isDeleted = FALSE */
        //var brands = await pool.query('SELECT MARCAS.*, MARCAS.name as nombre_marca, MARCAS.id as id_marca, CASE WHEN MARCAS.isDeleted = 0 THEN "Vigente" ELSE "Eliminado" END AS "ESTATUS", CASE WHEN MARCAS.last_modification_description = "UPDATED" THEN "Actualizado" ELSE "Creado" END AS "OPERACION", USUARIO.name as nombre, USUARIO.*, USUARIO.surname as apellido FROM brand MARCAS, user USUARIO WHERE MARCAS.isDeleted = FALSE and MARCAS.id_last_user = USUARIO.id');
        var brands = await pool.query('SELECT B.id as brandId, B.name as brandName, U.name as userName, U.surname as userSurname ,B.last_modification_description, B.last_modification_date, B.isDeleted FROM Brand as B JOIN User as U ON B.id_last_user = U.id WHERE B.isDeleted = 0');
        return modifyAttributes(brands);
    }
    catch(err){
        console.log(err);
    }
}

const getBrandById = async(id) => {
    try{
        var brand = await pool.query('SELECT * FROM brand WHERE id = ? and isDeleted = FALSE', id);
        if(brand.length === 0){
            return "Brand with id = "+ id +" does not exist";
        }
        return brand[0];
    }
    catch(err){
        console.log(err);
    }
}

    


module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getAllBrands,
    getBrandById,
    modifyAttributes
}

