import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "fs";
import { extname, resolve } from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline)


export const uploadRoutes = async (app: FastifyInstance) => {
  app.post("/upload", async (request, replay) => {
    const upload = await request.file({
      limits: {
        fieldNameSize: 5_242_880,
      }
    })

    if (!upload)
      return replay.status(400)

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat)
      return replay.status(400)

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(resolve(__dirname, "../../uploads/", fileName))

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat("://").concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()
    // const fileUrl = `${fullUrl}/uploads/${fileName}`

    return { fileUrl }
  })

}
