import prisma from "../../prisma/prisma.client";

async function insertRefreshToken(token: string , expirationDate: Date, userId: number){
    return await prisma.refreshtoken.create({
        data: {
            token,
            expirationDate,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function deleteRefreshToken(refreshToken: string){
    return await prisma.refreshtoken.delete({
        where: {
            token: refreshToken
        }
    });
}

async function getInfoByRefreshToken(refreshToken: string){
    return await prisma.refreshtoken.findUniqueOrThrow({
        where: {
            token: refreshToken
        }
    });
}

export {insertRefreshToken, deleteRefreshToken, getInfoByRefreshToken};