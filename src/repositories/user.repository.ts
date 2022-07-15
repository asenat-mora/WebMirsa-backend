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

export async function getUserById(id: number){
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
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

