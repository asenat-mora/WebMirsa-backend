const pool = require('../db/connection');

const addDetailsItem = (item, userId, description) => {
    return {
        ...item,
        id_last_user: userId,
        last_modification_description: description,
        last_modification_date: new Date()
    }
}

const createItem = async (item, userId, colors, brands) => {
	var connection = await pool.getConnection();

	item = addDetailsItem(item, userId, "CREATED");

	try {
		await connection.promise().beginTransaction();
		const itemQuery = await connection
			.promise()
			.query("INSERT INTO item SET ?", item);
		colors.forEach((color) => {
			connection.promise().query("INSERT INTO ItemColor SET ?", {
				item_Id: itemQuery[0].insertId,
				color_Id: color,
			});
		});

		brands.forEach((brand) => {
			connection.promise().query("INSERT INTO ItemBrand SET ?", {
				item_Id: itemQuery[0].insertId,
				brand_Id: brand,
			});
		});

		connection.promise().commit();
		connection.release();
	} catch (err) {
		connection.rollback();
		connection.release();
		if (err.code === "ER_DUP_ENTRY") {
			return "Product is already on the db";
		} else if (err.code === "ER_NO_REFERENCED_ROW_2") {
			return "User with id " + userId[i] + " does not exist";
		}
	}
};

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
        query = await pool.query('SELECT I.id,I.name,I.description,I.price,I.image,I.side,I.model,I.code, I.autoPartId, A.name as autoPartName FROM item I JOIN Autopart A on I.autoPartId = A.id WHERE id = ? AND isDeleted = FALSE', id);
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
    var item = await pool.query('SELECT I.id,I.name,I.description,I.price,I.image,I.side,I.model,I.code, I.autoPartId, A.name as autoPartName FROM item I JOIN Autopart A on I.autoPartId = A.id WHERE I.id = ? AND I.isDeleted = FALSE', id);
    if(item.length === 0){
        return "Item with id = "+ id +" does not exist";
    }
    item = item[0];
    const colors = await pool.query('SELECT C.id, C.name FROM color C JOIN ItemColor IC ON C.id = IC.color_Id WHERE IC.item_Id = ?', id);
    const colordId = []
    colors.forEach((color) => {
        colordId.push(color.id);
    });

    const brands = await pool.query('SELECT B.id, B.name FROM brand B JOIN ItemBrand IB ON B.id = IB.brand_Id WHERE IB.item_Id = ?', id);
    const brandId = []
    brands.forEach((brand) => {
        brandId.push(brand.id);
    });
    item = {
        ...item,
        colors: colordId,
        brands: brandId
    }

    return item;
}

const getAllItems = async() => {
    const items = await pool.query('SELECT I.id,I.name,I.description,I.price,I.image,I.side,I.model,I.code, I.autoPartId, A.name as autoPartName FROM item I JOIN Autopart A on I.autoPartId = A.id');
    for (let i = 0; i < items.length; i++) {
        const colors = await pool.query('SELECT C.id FROM color C JOIN ItemColor IC ON C.id = IC.color_Id WHERE IC.item_Id = ?', items[i].id);
        const colordId = []
        colors.forEach((color) => {
            colordId.push(color.id);
        });

        const brands = await pool.query('SELECT B.id FROM brand B JOIN ItemBrand IB ON B.id = IB.brand_Id WHERE IB.item_Id = ?', items[i].id);
        const brandId = []
        brands.forEach((brand) => {
            brandId.push(brand.id);
        });

        items[i] = {
            ...items[i],
            colors: colordId,
            brands: brandId
        }
    }
    return items;
}

const deleteItem = async(id, userId) => {
    item = addDetailsItem({
        isDeleted: true
    }, userId, "DELETED");
    try{

        var query = await pool.query('SELECT * FROM item WHERE id = ? and isDeleted = FALSE', id);
        if(query.length === 0){
            connection.release();
            return "Item with id = "+ id +" does not exist";
        }
        await pool.query('UPDATE item SET ? WHERE id = ?', [item, id]);
    }catch(err){
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