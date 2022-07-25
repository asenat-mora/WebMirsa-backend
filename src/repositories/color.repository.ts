import prisma from "../../prisma/prisma.client";

async function getAllColors() {
    return prisma.color.findMany({
        select: {
            id: true,
            name: true,
        }
    });
}

export { getAllColors };
