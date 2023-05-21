import fastify from "fastify"
import { memoriesRoutes } from "./routes/memories"
import cors from "@fastify/cors"
import { authRoutes } from "./routes/auth"
import fastifyJwt from "@fastify/jwt"
import fastifyMultipart from "@fastify/multipart"
import { uploadRoutes } from "./routes/upload"
import fastifyStatic from "@fastify/static"
import { resolve } from "path"

const app = fastify()


app.register(cors, {
  origin: true
})

app.register(fastifyJwt, {
  secret: process.env.SECRET ?? ""
})

app.register(fastifyMultipart)

app.register(authRoutes)
app.register(memoriesRoutes)
app.register(uploadRoutes)
app.register(fastifyStatic, {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads"
})

app.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(res => {
  console.log(res)
})

