import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
  findUserCart: publicProcedure.query(async ({ ctx, input }) => {
    const cart = await ctx.prisma.cart.findUnique({
      where: {
        id: ctx.session?.user?.id as string,
      },
      include: {
        cartProduct: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart)
      return ctx.prisma.cart.create({
        data: { user: { connect: { id: ctx.session?.user?.id as string } } },
        include: {
          cartProduct: {
            include: {
              product: true,
            },
          },
        },
      });
    return cart;
  }),
  addToCart: publicProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.cart.upsert({
        where: {
          id: ctx.session?.user?.id as string,
        },
        update: {
          cartProduct: {
            create: {
              product: {
                connect: {
                  id: input.id,
                },
              },
              amount: input.amount,
            },
          },
        },
        create: {
          id: ctx.session?.user?.id as string,
          cartProduct: {
            create: {
              product: {
                connect: {
                  id: input.id,
                },
              },
              amount: input.amount,
            },
          },
        },
      });
    }),
  deleteCartProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.cartProduct.delete({
        where: {
          cartId_productId: {
            cartId: ctx.session.user.id,
            productId: input.id,
          },
        },
      });
    }),
  checkoutCart: protectedProcedure
    .input(
      z.object({
        cartProduct: z
          .object({
            id: z.string(),
            amount: z.number().int(),
          })
          .array(),
        totalPaid: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [_, order] = await ctx.prisma.$transaction([
        ctx.prisma.cartProduct.deleteMany({
          where: {
            cartId: { equals: ctx.session.user.id },
            productId: {
              in: input.cartProduct.map((a) => a.id),
            },
          },
        }),
        ctx.prisma.order.create({
          data: {
            userId: ctx.session.user.id,
            totalPaid: input.totalPaid,
            orderProduct: {
              createMany: {
                data: input.cartProduct.map((product) => {
                  return {
                    productId: product.id,
                    amount: product.amount,
                  };
                }),
              },
            },
            status: "PENDING",
          },
        }),
        ...input.cartProduct.map((product) => {
          return ctx.prisma.product.update({
            where: {
              id: product.id,
            },
            data: {
              amount: {
                decrement: product.amount,
              },
            },
          });
        }),
      ]);
      return order;
    }),
});
