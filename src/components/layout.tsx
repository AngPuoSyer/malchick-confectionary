import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import { ShoppingCartOutlined } from "@mui/icons-material";
import Head from "next/head";

const DefaultLayout = ({ children }: React.PropsWithChildren) => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Malchik Confectionery</title>
        <meta
          name="description"
          content="Malchik Confectionery is a confectionery shop based in Kuala Selangor which has been running since 1952. Their main selling point is handmade chocolate-based products such as donuts, kuih and cookies."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="flex h-16 w-full items-center justify-around">
          <Link href="/">
            <div className="text-xl font-semibold">Malchik Confectionery</div>
          </Link>
          <div>
            <ul className="flex justify-between gap-16">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              {session && (
                <li>
                  <Link href="/orders">Orders</Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <ul className="flex items-center justify-between gap-8">
              {!session ? (
                <>
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/signup">Sign Up</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Button onClick={() => signOut()}>Logout</Button>
                  </li>
                  <li>
                    <IconButton onClick={() => router.push("/cart")}>
                      <ShoppingCartOutlined color="action" />
                    </IconButton>
                  </li>
                  <li>
                    <Avatar>{session.user?.name?.slice(0, 1)}</Avatar>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <hr />
        {children}
      </div>
    </>
  );
};

export default DefaultLayout;
