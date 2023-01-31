import { Avatar, Box, Button } from "@mui/material";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/AdminLayout";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import { useAdminRoute } from "../../../hooks/useAdminRoute";
import { api } from "../../../utils/api";
import { Order, Product, User } from "@prisma/client";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { format } from "date-fns";

const AdminOrderPage: NextPageWithLayout = () => {
  useAdminRoute();
  const router = useRouter();

  const trpcContext = api.useContext();
  const orders = api.order.findMany.useQuery({
    include: {
      user: true,
    },
    where: {
      status: {
        equals: "PENDING",
      },
    },
  });
  const fulfillOrderMutation = api.order.fulfillOrder.useMutation({
    onSuccess: () => {
      trpcContext.order.findMany.invalidate();
    },
  });

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 250,
    },
    {
      field: "user",
      headerName: "Ordered By",
      renderCell: (params: GridRenderCellParams<User>) => {
        return <div>{params.value?.name}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Ordered At",
      width: 250,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        return format(params.value, "HH:mmaa dd/MM/yyyy");
      },
    },
    {
      field: "totalPaid",
      headerName: "Price (RM)",
      valueFormatter: (params: GridValueFormatterParams<number>) =>
        params.value.toFixed(2),
    },
    {
      field: "",
      headerName: "",
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <Button
            onClick={() => {
              fulfillOrderMutation.mutate({
                id: params.id as string,
              });
            }}
          >
            Fulfill
          </Button>
        );
      },
    },
  ];

  return (
    <div className="container">
      <div className="my-4 flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Pending Orders</h1>
      </div>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={(orders.data as Order[]) ?? []}
          columns={columns}
          pageSize={10}
          rowHeight={70}
          loading={orders.isLoading}
          onRowClick={(e) => {
            router.push(`/admin/orders/${e.id}`);
          }}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
};

AdminOrderPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <AdminOrderPage />
    </AdminLayout>
  );
};

export default AdminOrderPage;
