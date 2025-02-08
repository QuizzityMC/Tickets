import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash("ADSFilms", 10)

  await prisma.user.upsert({
    where: { email: "quizzitymc@canarychat.me" },
    update: {},
    create: {
      email: "quizzitymc@canarychat.me",
      password: hashedPassword,
    },
  })

  console.log("Admin user seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

