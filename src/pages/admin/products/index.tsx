import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Avatar, Box, Button } from "@mui/material";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/AdminLayout";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import { useAdminRoute } from "../../../hooks/useAdminRoute";
import { api } from "../../../utils/api";
import { Product } from "@prisma/client";

const AdminProductPage: NextPageWithLayout = () => {
  useAdminRoute();
  const router = useRouter();

  const trpcContext = api.useContext();
  const products = api.product.findMany.useQuery({});
  const deleteProductMutation = api.product.deleteOne.useMutation({
    onSuccess: (data) => {
      trpcContext.product.findMany.invalidate({});
    },
  });

  const columns: GridColDef[] = [
    {
      field: "imgUrl",
      headerName: "",
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <Avatar
            src={
              params.value
                ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${params.value}`
                : `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/cursed.jpg`
            }
          />
        );
      },
    },
    { field: "name", headerName: "Name", width: 250 },
    {
      field: "price",
      headerName: "Price (RM)",
      valueFormatter: (params: GridValueFormatterParams<number>) =>
        params.value.toFixed(2),
    },
    { field: "amount", headerName: "Quantity" },
    { field: "createdAt", headerName: "Added At", width: 500 },
    {
      field: "id",
      headerName: "",
      width: 300,
      renderCell: (params: GridRenderCellParams<string>) => {
        return (
          <div className="flex items-center">
            <Button
              onClick={() => router.push(`/admin/products/${params.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              color="error"
              disabled={deleteProductMutation.isLoading}
              onClick={() => {
                deleteProductMutation.mutate({
                  where: {
                    id: params.value,
                  },
                });
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container">
      <div className="my-4 flex items-center justify-between">
        <h1 className="text-4xl font-semibold">Products</h1>
        <Button
          sx={{ padding: "1rem" }}
          onClick={() => {
            router.push("/admin/products/create");
          }}
        >
          Create
        </Button>
      </div>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <DataGrid
          rows={(products.data as Product[]) ?? []}
          columns={columns}
          pageSize={10}
          rowHeight={70}
          loading={products.isLoading}
          onRowClick={(e) => {
            router.push(`/admin/products/${e.id}`);
          }}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
};

AdminProductPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <AdminProductPage />
    </AdminLayout>
  );
};

export default AdminProductPage;
