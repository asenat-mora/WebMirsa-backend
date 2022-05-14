const pool = require('../db/connection');

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
    try{
        var brands = await pool.query('SELECT * FROM brand WHERE isDeleted = FALSE');
        return brands;
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
    getBrandById
}

