const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient();

const createUser = async(user) => {
    return await prisma.user.create(user);
}

const findUserById = async(id) => {
    return await prisma.user.findUnique({
        where: {id}, 
        select:{
            id: true,
            name: true,
            surname: true,
            email: true,
        }
        });
}

const findAllUsers = async() => {
    return await prisma.user.findMany({
        select:{
            id: true,
            name: true,
            surname: true,
            email: true,
            verificationEmail: true,
        }
    });
}

const updateUser = async(id, user) => {
    return await prisma.user.update({
        where: {id},
        data: user,
        select:{
            id: true,
            name: true,
            surname: true,
            email: true,
            verificationEmail: true,
        }
    });
}

const deleteUser = async(id) => {
    return await prisma.user.delete({where: {id}});
}

module.exports = {
    createUser,
    findUserById,
    findAllUsers,
    updateUser,
    deleteUser
}