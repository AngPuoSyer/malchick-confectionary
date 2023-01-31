import { randomUUID } from "crypto";
import path from "path";
import { z } from "zod";
import {
  ProductCreateOneSchema,
  ProductDeleteOneSchema,
  ProductFindManySchema,
  ProductFindUniqueSchema,
  ProductUpdateOneSchema,
} from "../../../../prisma/generated-zod-schemas/schemas";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: process.env.aws_region,
  signatureVersion: "v4",
  sessionToken: process.env.aws_session_token,
});

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  findMany: publicProcedure
    .input(ProductFindManySchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findMany(input);
    }),
  findById: publicProcedure
    .input(ProductFindUniqueSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique(input);
    }),
  createOne: publicProcedure
    .input(ProductCreateOneSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.create(input);
    }),
  updateOne: publicProcedure
    .input(ProductUpdateOneSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.update(input);
    }),
  deleteOne: adminProcedure
    .input(ProductDeleteOneSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.delete(input);
    }),
  productPresignedUrl: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const fileMeta = path.parse(input.fileName);
      const key = `products/${randomUUID()}${fileMeta.ext}`;
      const s3Params = {
        Bucket: process.env.bucket_name,
        Key: key,
        Expires: 60,
        ContentType: `image/${fileMeta.ext.replace(".", "")}`,
      };

      const uploadUrl = s3.getSignedUrl("putObject", s3Params);

      return {
        uploadUrl,
        key: key,
      };
    }),
});
