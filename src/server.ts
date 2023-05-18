import fastify from "fastify"
import { PrismaClient } from "prisma/prisma-client"

const app = fastify()
const prisma = new PrismaClient()

app.get("/v1/hello", async () => {
  const users = await prisma.user.findMany()
  return users
})


app.listen({
  port: 3333,
}).then(res => {
  console.log(res)
})

