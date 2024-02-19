const prisma = require("./prisma");

const findUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                candidate: true,
                referee: true
            }
        });
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const findUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                candidate: true,
                referee: true
            }
        });
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const findUserByEmailProvider = async (email, provider) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
                provider
            }
        });
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    findUserByEmail,
    findUserById
}