import React from "react";
import Link from "next/link";
import { Avatar, Button } from "@mui/material";
import { signOut } from "next-auth/react";
import Head from "next/head";

const DefaultLayout = ({ children }: React.PropsWithChildren) => {
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
                <Link href="/admin/products">Products</Link>
              </li>
              <li>
                <Link href="/admin/orders">Orders</Link>
              </li>
              <li>
                <Link href="/admin/sales">Sales</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="flex items-center justify-between gap-8">
              <li>
                <Button onClick={() => signOut()}>Logout</Button>
              </li>
              <li>
                <Avatar>A</Avatar>
              </li>
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
