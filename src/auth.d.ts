import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number }
    user: {
      sub: string
      name: string
      avatarUrl: string
    }
  }
}