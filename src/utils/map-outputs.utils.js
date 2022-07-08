
//Map outputs to their counterpart in spanish
function modifyAttributes(objectArray){

    const operation = { 
        "CREATED": "Creado",
        "UPDATED": "Actualizado",
        "DELETED": "Eliminado"
    }

    const status = { 
        0: "Vigente",
        1: "Eliminado"
    }

    for(var i = 0; i < objectArray.length; i++){
        objectArray[i].isDeleted = status[objectArray[i].isDeleted];
        objectArray[i].last_modification_description = operation[objectArray[i].last_modification_description];
    }

    return objectArray;
}

module.exports = {
    modifyAttributes
}
