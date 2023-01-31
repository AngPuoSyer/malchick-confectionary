import { Button, TextField } from "@mui/material";
import React, { ReactElement, useRef, useState } from "react";
import { DropzoneArea } from "mui-file-dropzone";
import { useRouter } from "next/router";
import AdminLayout from "../../../../components/AdminLayout";
import { api } from "../../../../utils/api";
import { NextPageWithLayout } from "../../../_app";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { isEmpty } from "lodash";

const ProductCreatePage: NextPageWithLayout = () => {
  const [thumbnail, setThumbnail] = useState<File[]>();
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const product = api.product.findById.useQuery({
    where: {
      id: router.query.id as string,
    },
  });
  const editProductMutation = api.product.updateOne.useMutation({
    onSuccess: (data) => {
      router.push("/admin/products");
    },
  });

  const uploadImgMutation = api.product.productPresignedUrl.useMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    // TODO: S3 presigned url api, upload and save url
    let url = "";
    if (!isEmpty(thumbnail)) {
      const imgData = await uploadImgMutation.mutateAsync({
        // @ts-ignore
        fileName: thumbnail[0].name!,
      });
      const fetched = await fetch(imgData.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "image/*" },
        // @ts-ignore
        body: thumbnail[0],
      });
      url = imgData.key;
    }
    editProductMutation.mutate({
      where: {
        id: router.query.id as string,
      },
      data: {
        ...(e as any),
        // ...(!!usrl ? { imgUrl: url } : {}),
      },
    });
  };
  return (
    <div className="container">
      <h1 className="text-4xl font-semibold">Edit Product</h1>
      {product.data && (
        <FormContainer
          onSuccess={handleSubmit}
          defaultValues={{
            // @ts-ignore
            name: product.data!.name as string,
            price: product.data.price,
            amount: product.data.amount,
            description: product.data.description,
          }}
        >
          <div className="mt-6 grid w-full grid-cols-9 gap-6">
            <TextFieldElement
              label="Name"
              name="name"
              className="col-span-5"
              required
              inputRef={nameRef}
            />
            <TextFieldElement
              label="Price (RM)"
              className="col-span-2"
              type="number"
              name="price"
              required
              inputProps={{
                min: 0,
                step: 0.01,
              }}
              inputRef={priceRef}
            />
            <TextFieldElement
              label="Quantity"
              className="col-span-2"
              name="amount"
              type="number"
              required
              inputProps={{
                min: 0,
              }}
              inputRef={amountRef}
            />
            <TextFieldElement
              label="Description"
              className="col-span-9"
              multiline
              rows={3}
              name="description"
              required
              inputRef={descriptionRef}
            />
            <div className="col-span-9">
              <DropzoneArea
                initialFiles={[
                  `${
                    product.data.imgUrl ||
                    `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/cursed.jpg`
                  }`,
                ]}
                acceptedFiles={["image/*"]}
                fileObjects={[]}
                dropzoneText={"Upload new thumbnail for the product"}
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
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outlined"
              size="large"
              sx={{ padding: "1rem" }}
              className="col-span-2 "
              disabled={editProductMutation.isLoading}
            >
              Submit
            </Button>
          </div>
        </FormContainer>
      )}
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
