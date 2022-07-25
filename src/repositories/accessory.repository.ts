import prisma from "../../prisma/prisma.client";
import { IAccessory, IAccessoryEdit } from "../interfaces/accessory.interface";
import  Operations from "../models/operations.model";

async function createAccessory(accessory: IAccessory, userId: number) {
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
            user: {
                select: {
                    id: true,
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
            isDeleted: true,
            user: {
                select: {
                    id: true,
                }
            }
        }
    });
}

export { createAccessory, updateAccessory, deleteAccessory, getAllAccessories, getAccessoryById };    
