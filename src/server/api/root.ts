import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  user: userRouter,
  cart: cartRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
