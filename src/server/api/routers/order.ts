import { z } from "zod";
import {
  OrderCountAggregateInputObjectSchema,
  OrderCreateOneSchema,
  OrderFindManySchema,
  OrderFindUniqueSchema,
  OrderUpdateOneSchema,
} from "../../../../prisma/generated-zod-schemas/schemas";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc";

export const orderRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany();
  }),
  findMany: publicProcedure
    .input(OrderFindManySchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findMany(input);
    }),
  createOne: publicProcedure
    .input(OrderCreateOneSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.order.create(input);
    }),
  updateOne: publicProcedure
    .input(OrderUpdateOneSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.order.update(input);
    }),
  findOne: protectedProcedure
    .input(OrderFindUniqueSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findUnique(input);
    }),
  fulfillOrder: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.order.update({
        where: {
          id: input.id,
        },
        data: {
          status: "FULFILLED",
        },
      });
    }),
  getSales: adminProcedure.query(({ ctx, input }) => {
    return ctx.prisma.order.aggregate({
      _sum: {
        totalPaid: true,
      },
      where: {
        status: {
          equals: "FULFILLED",
        },
      },
    });
  }),
});
