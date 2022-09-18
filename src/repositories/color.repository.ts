import prisma from "../../prisma/prisma.client";
import { IColor, IColorEdit } from "../interfaces/color.interface";
import Operations from "../models/operations.model";

async function createColor(color: IColor, userId: number) {
    return prisma.color.create({
        data: {
            name: color.name,
            last_modification_description: Operations.Created,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function updateColor(color: IColorEdit, userId: number) {
    return await prisma.color.update({
        where: {
            id: color.id
        },
        data: {
            name: color.name,
            last_modification_description: Operations.Updated,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function getAllColors() {
    return prisma.color.findMany({
        select: {
            id: true,
            name: true,
            last_modification_date: true,
            last_modification_description: true,
            user: {
                select: {
                    name: true,
                    surname: true
                }
            }
        }
    });
}

async function getColorById(colorId: number) {
    return prisma.color.findUnique({
        where: {
            id: colorId
        },
        select: {
            id: true,
            name: true,
        }
    });
}

async function deleteColor(colorId: number) {
    return await prisma.color.delete({
        where: {
            id: colorId
        }
    });
}


export { createColor, updateColor, getAllColors, getColorById, deleteColor };
