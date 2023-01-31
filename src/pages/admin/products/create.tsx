import { Button, TextField } from "@mui/material";
import React, { ReactElement, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import { DropzoneArea } from "mui-file-dropzone";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import { ProductStatusEnum } from "@prisma/client";

const ProductCreatePage: NextPageWithLayout = () => {
  const [thumbnail, setThumbnail] = useState<File[]>();
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const createProductMutation = api.product.createOne.useMutation({
    onSuccess: (data) => {
      router.push("/admin/products");
    },
  });

  const uploadImgMutation = api.product.productPresignedUrl.useMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let url: string | null = null;
    if (thumbnail) {
      const imgData = await uploadImgMutation.mutateAsync({
        fileName: thumbnail[0]?.name!,
      });
      const fetched = await fetch(imgData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/*" },
        body: thumbnail[0],
      });
      url = imgData.key;
    }
    const data = {
      name: nameRef.current?.value as string,
      price: +priceRef.current?.value!,
      amount: +amountRef.current?.value!,
      description: descriptionRef.current?.value as string,
      status: ProductStatusEnum.PUBLISHED,
      imgUrl: url,
    };
    createProductMutation.mutate({
      data,
    });
  };
  return (
    <div className="container">
      <h1 className="text-4xl font-semibold">Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid w-full grid-cols-9 gap-6">
          <TextField
            label="Name"
            className="col-span-5"
            required
            inputRef={nameRef}
          />
          <TextField
            label="Price (RM)"
            className="col-span-2"
            type="number"
            required
            inputProps={{
              min: 0,
              step: 0.01,
            }}
            inputRef={priceRef}
          />
          <TextField
            label="Quantity"
            className="col-span-2"
            type="number"
            required
            inputProps={{
              min: 0,
            }}
            inputRef={amountRef}
          />
          <TextField
            label="Description"
            className="col-span-9"
            multiline
            rows={3}
            required
            inputRef={descriptionRef}
          />
          <div className="col-span-9">
            <DropzoneArea
              acceptedFiles={["image/*"]}
              fileObjects={[]}
              dropzoneText={"Upload thumbnail for the product"}
              onChange={(files) => setThumbnail(files)}
              filesLimit={1}
              previewGridProps={{
                container: {
                  justifyContent: "center",
                  alignItems: "center",
                },
                item: {
                  sx: {
                    objectFit: "content",
                  },
                },
              }}
            />
          </div>
          <Button
            variant="outlined"
            size="large"
            color="error"
            sx={{ padding: "1rem" }}
            className="col-span-2 col-start-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outlined"
            size="large"
            sx={{ padding: "1rem" }}
            className="col-span-2 "
            disabled={createProductMutation.isLoading}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

ProductCreatePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <ProductCreatePage />
    </AdminLayout>
  );
};

export default ProductCreatePage;
