import fastify from "fastify"
import { memoriesRoutes } from "./routes/memories"
import cors from "@fastify/cors"
import { authRoutes } from "./routes/auth"
import fastifyJwt from "@fastify/jwt"

const app = fastify()


app.register(cors, {
  origin: true
})

app.register(fastifyJwt, {
  secret: process.env.SECRET ?? ""
})

app.register(authRoutes)
app.register(memoriesRoutes)

app.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(res => {
  console.log(res)
})

