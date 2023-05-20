import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from "zod"

export const memoriesRoutes = async (app: FastifyInstance) => {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "asc"
      }
    })

    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 120).concat("...")
      }
    })
  })

  app.get("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id }
    })

    return memory
  })

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: "56b9bee4-8094-4231-8ba9-65245eae9d84"
      }
    })

    return memory
  })


  app.put("/memories/:id", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)


    const memory = await prisma.memory.update({
      where: { id },
      data: {
        content,
        coverUrl,
        isPublic,
        userId: "56b9bee4-8094-4231-8ba9-65245eae9d84"
      }
    })

    return memory

  })

  app.delete("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: { id }
    })
  })

}