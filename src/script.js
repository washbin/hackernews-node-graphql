import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const main = async () => {
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
};

main()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
