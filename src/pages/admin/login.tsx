import { NextPage } from "next";
import { Button, TextField } from "@mui/material";
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import AdminLayout from "../../components/AdminLayout";

const AdminLoginPage: NextPageWithLayout = () => {
  return (
    <div className="container grid h-screen place-items-center">
      <div className="mx-auto  w-1/2 -translate-y-2.5 rounded border-2 border-gray-500">
        <div className=" w-full p-8">
          <h1 className="text-4xl font-bold">Login Admin</h1>
          <div className="mt-6 flex flex-col gap-10">
            <TextField label="Email" required></TextField>
            <TextField label="Password" type="password" required></TextField>
          </div>
          <div className="flex justify-between">
            <div></div>
            <Button size="large" className="mt-6 mr-6">
              Login
            </Button>
          </div>
        </div>
      </div>
      <div className="h-1/12"></div>
    </div>
  );
};

AdminLoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <AdminLoginPage />
    </AdminLayout>
  );
};

export default AdminLoginPage;
