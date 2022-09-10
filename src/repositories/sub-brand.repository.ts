import prisma from "../../prisma/prisma.client";
import { ISubBrand } from "../interfaces/sub-brand.interface";
import  Operations from "../models/operations.model";

async function createSubBrand(subBrand : ISubBrand, userId: number) {
    return await prisma.subbrand.create({
        data: {
            name : subBrand.name,
            last_modification_description: Operations.Created,
            user: {
                connect: {
                    id: userId
                }
            },
            brand: {
                connect: {
                    id: subBrand.brandId
                }
            }
        }
    });
}

async function deleteSubBrand(subBrandId: number, userId: number){
    return await prisma.subbrand.update({
        where: {
            id: subBrandId
        },
        data: {
            isDeleted: true,
            last_modification_description: Operations.Deleted,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function getAllSubBrands(){
    return await prisma.subbrand.findMany({
        where: {
            isDeleted: false
        },
        select: {
            id: true,
            name: true,
            brandId: true,
            last_modification_description: true,
            user : {
                select: {
                    id: true,
                }
            }
        }
    });
}

async function getSubBrandsByBrandId(brandId: number){
    return await prisma.subbrand.findMany({
        where: {
            brandId: brandId,
            isDeleted: false
        },
        select: {
            id: true,
            name: true,
            brandId: true,
            last_modification_description: true,
            user : {
                select: {
                    id: true,
                }
            }
        }
    });
}

export { createSubBrand, deleteSubBrand, getAllSubBrands, getSubBrandsByBrandId };
