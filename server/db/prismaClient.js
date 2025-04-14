import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // await prisma.user.deleteMany();
    // await prisma.message.deleteMany();
    // await prisma.chat.deleteMany();
    // await prisma.group.deleteMany();
    // await prisma.groupMessage.deleteMany();
}
main()

export default prisma;