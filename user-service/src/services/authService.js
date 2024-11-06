import prismaService from "../config/prismaClient.js";
export class AuthServices {
    async create(data) {
        try {
            const results = await prismaService.user.create({
                data: {
                    name: data.name,
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    createdBy: data.createdBy
                }
            })
            return results;
        } catch (error) {
            throw error
        }
    }

    async findUserByUsername(username) {
        try {
            const results = await prismaService.user.findUnique({
                where: {
                    username
                }
            });
            return results;
        } catch (error) {
            throw error;
        }
    }
}