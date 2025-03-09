const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// async function main() {
//     await prisma.message.deleteMany();
// }
// main()

module.exports = prisma;