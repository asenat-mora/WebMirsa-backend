const pool = require('../db/connection');

const addDetailsItem = (item, userId, description) => {
    return {
        ...item,
        id_last_user: userId,
        last_modification_description: description,
        last_modification_date: new Date()
    }
}

const createItem = async (item, userId, colors) => {
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

		connection.promise().commit();
		connection.release();
	} catch (err) {
		connection.rollback();
		connection.release();
		if (err.code === "ER_DUP_ENTRY") {
			return "Product is already on the db";
		} else if (err.code === "ER_NO_REFERENCED_ROW_2") {
            console.log(err)
			return "Error with a foreign key";
		}
        console.log(err)
	}
};

const updateItem = async(id, item, userId, colors) => {

    var connection = await pool.getConnection();
    item = addDetailsItem(item, userId, "UPDATED");

    //Borrar todos los colores
    try {
		await connection.promise().beginTransaction();
	 	connection.promise().query("DELETE FROM ItemColor WHERE item_id = " + id); 
		connection.promise().commit();
		connection.release();

    //Actualiza los demas datos
	try {
		await connection.promise().beginTransaction();
		const itemQuery = await connection
			.promise()
			.query("UPDATE item SET ? WHERE ID = " + id, item);

            //Agregar los nuevos colores
		    colors.forEach((color) => {
		 	connection.promise().query("INSERT INTO ItemColor SET ?", {
				item_Id: id,
				color_Id: color,
			}); 
		});

		connection.promise().commit();
		connection.release();

	} catch (err) {
 		connection.rollback();
		connection.release();
        console.log(err)
        return err.code;
          
	}

	} catch (err) {
 		connection.rollback();
		connection.release();
        console.log(err)
        return err.code;
	}

}

const getItemByCode = async(code) => {
    var item = await pool.query('SELECT I.id,I.name,I.description,I.price,I.image,I.side,I.model,I.code, I.autoPartId, A.name as autoPartName, B.name as brandName, B.id as brandId FROM item I JOIN Autopart A on I.autoPartId = A.id JOIN Brand B on I.brandId = B.id WHERE I.code = ? AND I.isDeleted = FALSE', code);
    if(item.length === 0){
        return "Item with code = "+ code +" does not exist";
    }
    item = item[0];
    const colors = await pool.query('SELECT C.id, C.name FROM color C JOIN ItemColor IC ON C.id = IC.color_Id WHERE IC.item_Id = ?', item.id);
    const colordId = []
    colors.forEach((color) => {
        colordId.push(color.id);
    });

    item = {
        ...item,
        colors: colordId,
    }

    return item;
}

const getItemById = async(id) => {
    var item = await pool.query('SELECT I.id,I.name,I.description,I.price,I.image,I.side,I.model,I.code, I.autoPartId, A.name as autoPartName, B.name as brandName, B.id as brandId FROM item I JOIN Autopart A on I.autoPartId = A.id JOIN Brand B on I.brandId = B.id WHERE I.id = ? AND I.isDeleted = FALSE', id);
    if(item.length === 0){
        return "Item with id = "+ id +" does not exist";
    }
    item = item[0];
    const colors = await pool.query('SELECT C.id, C.name FROM color C JOIN ItemColor IC ON C.id = IC.color_Id WHERE IC.item_Id = ?', id);
    const colorsInfo = []
    colors.forEach((color) => {
        colorsInfo.push({
            id: color.id,
            name: color.name
        });
    });

    item = {
        ...item,
        colors: colorsInfo,
    }

    return item;
}

const getAllItems = async() => {
    const items = await pool.query('SELECT I.id,I.name,I.description,I.price,I.image,I.side,I.model,I.code, I.autoPartId, A.name as autoPartName, B.name as brandName, B.id as brandId FROM item I JOIN Autopart A on I.autoPartId = A.id JOIN Brand B on I.brandId = B.id WHERE I.isDeleted = FALSE');
    for (let i = 0; i < items.length; i++) {
        const colors = await pool.query('SELECT C.id, C.name FROM color C JOIN ItemColor IC ON C.id = IC.color_Id WHERE IC.item_Id = ?', items[i].id);
        const colorsResponse = []
        colors.forEach((color) => {
            colorsResponse.push({
                id: color.id,
                name: color.name
            });
        });

        items[i] = {
            ...items[i],
            colors: colorsResponse,
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
    deleteItem,
    getItemByCode
}