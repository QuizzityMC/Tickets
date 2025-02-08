import fs from "fs/promises"
import path from "path"
import bcrypt from "bcrypt"

async function main() {
  const hashedPassword = await bcrypt.hash("ADSFilms", 10)
  const adminUser = {
    id: 1,
    email: "quizzitymc@canarychat.me",
    password: hashedPassword,
  }

  const usersFilePath = path.join(process.cwd(), "data", "users.json")

  try {
    await fs.writeFile(usersFilePath, JSON.stringify([adminUser], null, 2))
    console.log("Admin user seeded successfully")
  } catch (error) {
    console.error("Error seeding admin user:", error)
  }
}

main()

