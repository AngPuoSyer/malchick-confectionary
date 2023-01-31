import {
  Avatar,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { OrderProduct, Product } from "@prisma/client";
import { format } from "date-fns";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../utils/api";

const OrderDetailPage: NextPage = () => {
  const router = useRouter();
  const order = api.order.findOne.useQuery({
    where: {
      id: router.query.id as string,
    },
    include: {
      orderProduct: {
        include: {
          product: true,
        },
      },
    },
  });
  return (
    <div className="container">
      <div className="my-4 text-4xl font-bold">Order {router.query.id}</div>
      <h2 className="my-4 text-xl font-semibold">Proudcts</h2>
      <div className="my-4 flex w-1/2 justify-between text-lg font-medium">
        <h3>
          Ordered At:{" "}
          {order.data && format(order.data?.createdAt, "HH:mmaa dd/MM/yyyy")}
        </h3>
        <h3>
          <>
            Fulfilled At:{" "}
            {order.data?.status === "FULFILLED" ? order.data.updatedAt : "-"}
          </>
        </h3>
      </div>
      <TableContainer className="w-1/2">
        <TableHead>
          <TableRow key={`odjsdflkasd${router.query.id}`}>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {((order.data as any)?.orderProduct as OrderProduct[])?.map((p) => {
            return (
              <TableRow>
                <TableCell>
                  <Avatar
                    src={
                      ((p as any).product as Product).imgUrl
                        ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${
                            ((p as any).product as Product).imgUrl
                          }`
                        : `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/cursed.jpg`
                    }
                  ></Avatar>
                </TableCell>
                <TableCell>{((p as any).product as Product).name}</TableCell>
                <TableCell>{p.amount}</TableCell>
                <TableCell>
                  {((p as any).product as Product).price.toFixed(2)}
                </TableCell>
                <TableCell>
                  {(((p as any).product as Product).price * p.amount).toFixed(
                    2
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    className="text-blue-700 underline"
                    href={`/products/${p.productId}`}
                  >
                    View Product
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableContainer>
    </div>
  );
};

export default OrderDetailPage;
