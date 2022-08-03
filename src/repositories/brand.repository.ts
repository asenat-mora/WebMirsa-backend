import prisma from "../../prisma/prisma.client";
import { IBrand, IBrandEdit } from "../interfaces/brand.interface";
import  Operations from "../models/operations.model";

async function createBrand(brand: IBrand, userId: number) {
    return prisma.brand.create({
        data: {
            ...brand,
            last_modification_description: Operations.Created,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function updateBrand(brand: IBrandEdit, userId: number) {
    return await prisma.brand.update({
        where: {
            id: brand.id
        },
        data: {
            name: brand.name,
            key: brand.key,
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
            key: true,
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

async function deleteBrand(id: number, userId: number) {
    return await prisma.brand.update({
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

async function getAllBrands() {
    return await prisma.brand.findMany({
        select: {
            id: true,
            name: true,
            key: true,
            last_modification_description: true,
            user: {
                select: {
                    id: true,
                }
            }
        }
    });
}

async function getBrandById(id: number) {
    return await prisma.brand.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            key: true,
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

export { createBrand, updateBrand, deleteBrand, getAllBrands, getBrandById };
