import prisma from "../../prisma/prisma.client";
import { IColor, IColorEdit } from "../interfaces/color.interface";

async function createColor(color: IColor) {
    return prisma.color.create({
        data: {
            name: color.name,
        }
    });
}

async function updateColor(color: IColorEdit) {
    return await prisma.color.update({
        where: {
            id: color.id
        },
        data: {
            name: color.name,
        }
    });
}

async function getAllColors() {
    return prisma.color.findMany({
        select: {
            id: true,
            name: true,
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
