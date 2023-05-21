import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { z } from "zod"

export const memoriesRoutes = async (app: FastifyInstance) => {

  app.addHook("preHandler", async (request) => {
    await request.jwtVerify()
  })

  app.get("/memories", async (request) => {
    await request.jwtVerify()

    const { sub: userId } = request.user

    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "asc"
      },
      where: {
        userId
      }
    })


    return memories.map(memory => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 120).concat("..."),
        createdAt: memory.createdAt
      }
    })
  })

  app.get("/memories/:id", async (request, replay) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id }
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return replay.status(401).send()
    }

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
        userId: request.user.sub
      }
    })

    return memory
  })


  app.put("/memories/:id", async (request, replay) => {
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

    const foundedMemory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (!foundedMemory.isPublic && foundedMemory.userId !== request.user.sub) {
      return replay.status(401).send()
    }

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

  app.delete("/memories/:id", async (request, replay) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    })

    if (memory.userId !== request.user.sub) {
      return replay.status(401).send()
    }

    await prisma.memory.delete({
      where: { id }
    })
  })

}