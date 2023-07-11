import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Link,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const { data: products, isLoading } = api.product.findMany.useQuery({
    orderBy: [
      {
        name: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    where: {
      status: "PUBLISHED",
    },
    take: 3,
  });
  const router = useRouter();
  useEffect(() => {
    if ((session?.user as any)?.role === "ADMIN")
      router.push("/admin/products");
  }, [session]);
  return (
    <>
      <main>
        <div className="container">
          <div className="m-12 flex h-[50vh] w-full gap-6">
            <div className="relative m-6 w-4/12">
              <Image
                src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/malchickex.png`}
                fill
                alt="malchickexmain"
              ></Image>
            </div>
            <div className="mx-auto mt-16 w-8/12 text-lg font-medium">
              <p className="mb-16">
                Malchik Confectionery has its humble beginnings as a family run
                roadside stall in 1952 in Kuala Selangor. Starting with
                chocolate-infused kuih, the business grew as a local sensation
                within months. After two generations of chocolatey goodness,
                Malchik Confectionery is now online and ready to produce more
                chocolate treats for you!
              </p>
              <Button size="large" onClick={() => router.push("/products")}>
                View Products
              </Button>
            </div>
          </div>
          <div className="my-10 flex w-full justify-between">
            <h2 className="text-4xl font-bold">Our Products</h2>
            <Link href="/products">View More</Link>
          </div>
          <Grid
            container
            spacing={2}
            columns={20}
            justifyContent="center"
            className="mb-6"
          >
            {products &&
              products.map((product, index) => {
                return (
                  <Grid item xs={5}>
                    <Link href={`/products/${product.id}`}>
                      <Card sx={{ height: 420, borderRadius: 3 }}>
                        <CardHeader title={product.name}></CardHeader>
                        <CardMedia
                          sx={{ height: 260 }}
                          className="classes.Cardedia"
                          title={product.name}
                        >
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Image
                              src={
                                product.imgUrl
                                  ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${product.imgUrl}`
                                  : `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/cursed.jpg`
                              }
                              alt={`${product.name} ${index}`}
                              fill
                            />
                          </div>
                        </CardMedia>
                        <CardContent>
                          <span className="line-clamp-3">
                            {product.description}
                          </span>
                        </CardContent>
                        <CardActions>
                          <div className="w-full text-right text-lg font-bold">
                            RM{product.price}
                          </div>
                        </CardActions>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
          </Grid>
        </div>
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
