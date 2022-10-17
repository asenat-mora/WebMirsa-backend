import prisma from "../../prisma/prisma.client";
import { IAccessory, IAccessoryEdit } from "../interfaces/accessory.interface";
import  Operations from "../models/operations.model";

async function createAccessory(accessory: IAccessory, userId: number) {

    const checkAccessory = await getAccessoryByName(accessory.name);

    if(checkAccessory){
        return await prisma.accessory.update({
            where: {
                id: checkAccessory.id
            },
            data: {
                isDeleted: false,
                last_modification_description: Operations.Created,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }else{
        return prisma.accessory.create({
            data: {
                name: accessory.name,
                last_modification_description: Operations.Created,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    
}

async function updateAccessory(accessory: IAccessoryEdit, userId: number){
    return await prisma.accessory.update({
        where: {
            id: accessory.id
        },
        data: {
            name: accessory.name,
            last_modification_description: Operations.Updated,
            user: {
                connect: {
                    id: userId
                }
            }
        },
        select: {
            id: true,
            name: true,
            last_modification_description: true,
            user: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
}

async function deleteAccessory(id: number, userId: number){
    return await prisma.accessory.update({
        where: {
            id
        },
        data: {
            last_modification_description: Operations.Deleted,
            isDeleted: true,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function getAllAccessories(){
    return await prisma.accessory.findMany({
        where: {
            isDeleted: false
        },
        select: {
            id: true,
            name: true,
            last_modification_description: true,
            last_modification_date: true,
            user: {
                select: {
                    name : true,
                    surname: true
                }
            }
        }
    });
}

async function getAccessoryById(id: number){
    return await prisma.accessory.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            last_modification_description: true,
            last_modification_date : true,
            isDeleted: true,
            user: {
                select: {
                    name : true,
                    surname: true
                }
            }
        }
    });
}

async function getAccessoryByName(name: string){
    return await prisma.accessory.findFirst({
        where: {
            AND:[
                {
                    name: name,
                    isDeleted: true
                }
            ]
            
        },
        select: {
            id: true,
            name: true,
            last_modification_description: true,
            last_modification_date : true,
            isDeleted: true
        }
    });
}

export { createAccessory, updateAccessory, deleteAccessory, getAllAccessories, getAccessoryById };    
