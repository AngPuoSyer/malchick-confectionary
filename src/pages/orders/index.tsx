import { NextPage } from "next";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { api } from "../../utils/api";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";

const OrdersPage: NextPage = () => {
  const [tabIndex, setTabIndex] = useState("1");

  const { data: session } = useSession();
  const orders = api.order.findMany.useQuery({
    where: {
      userId: {
        equals: session?.user!.id,
      },
      status: {
        equals: "PENDING",
      },
    },
  });
  const fulfilledOrders = api.order.findMany.useQuery({
    where: {
      userId: {
        equals: session?.user!.id,
      },
      status: {
        equals: "FULFILLED",
      },
    },
  });
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };
  return (
    <div className="container">
      <div className="my-6 text-4xl font-semibold">Orders</div>
      <TabContext value={tabIndex}>
        <TabList onChange={handleChange}>
          <Tab label="Pending" value="1" />
          <Tab label="Fulfilled" value="2" />
        </TabList>
        <TabPanel value="1">
          <TableContainer>
            <TableHead>
              <TableRow key="order lasf;jsaldkfjlasekf">
                <TableCell>ID</TableCell>
                <TableCell>Order At</TableCell>
                <TableCell>Paid (RM)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.data?.map((order) => {
                return (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {format(order.createdAt, "HH:mmaa dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{order.totalPaid.toFixed(2)}</TableCell>
                    <TableCell>
                      <Link
                        className="text-blue-700 underline"
                        href={`/orders/${order.id}`}
                      >
                        View Order
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TableContainer>
        </TabPanel>
        <TabPanel value="2">
          <TableContainer>
            <TableRow key="fulfilled lasf;jsaldkfjlasekf">
              <TableCell>ID</TableCell>
              <TableCell>Fulfilled At</TableCell>

              <TableCell>Paid (RM)</TableCell>
            </TableRow>
            {fulfilledOrders.data?.map((order) => {
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {format(order.updatedAt, "HH:mmaa dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{order.totalPaid.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableContainer>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default OrdersPage;
