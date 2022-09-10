import prisma from "../../prisma/prisma.client";
import { IUser } from "../interfaces/user.interface";

export async function createUser(user: IUser, roles: Array<number>){
    const userCreated = await prisma.user.create({
        data: {
            ...user,
            roles:{
                create: roles.map(role => ({roleId: role}))
            }
        }
    });
    return userCreated;
}

export async function updateUser(user: IUser, roles: Array<number>, userId: number){
    const rolesDeleted = prisma.userroles.deleteMany({
        where: {
            userId: userId
        }
    });

    const userUpdated = prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...user,
            roles:{
                create: roles.map(role => ({roleId: role}))
            }
        }, select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            roles: {
                select: {
                    roleId: true
                }
            }
        }
    });

    const transaction = await prisma.$transaction([rolesDeleted, userUpdated]);
    return transaction[1];
}
     
export async function getAllUsers(){
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            roles: {
                select: {
                    roleId: true
                }
            }
        }
    });
}

export async function getUserById(id: number){
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            verificationEmail: true,
            roles: {
                select: {
                    roleId: true,
                }
            }
        }
    });
    return user;
}

export async function getUserByEmail(email: string){
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            email: true,
            surname: true,
            password: true,
            roles: {
                select: {
                    roleId: true,
                }
            }
        }
    });
    return user;
}

