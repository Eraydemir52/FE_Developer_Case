const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10); // Şifreyi hash'liyoruz
  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      age: 30,
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
