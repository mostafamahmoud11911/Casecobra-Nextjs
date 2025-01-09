import { createUploadthing, type FileRouter } from "uploadthing/next";
import z from "zod";
import Sharp from "sharp";
import { db } from "../../../../db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
    },
  })
    .input(z.object({ configId: z.string().optional() }))

    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();
      const { width, height } = await Sharp(buffer).metadata();

      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            width: width || 500,
            height: height || 500,
            imageUrl: file?.url,
          },
        });

        return {configId: configuration.id};
      } else {
        const configurationUpdated = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        });

        return {configId: configurationUpdated.id};
      }

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
