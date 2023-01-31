import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

import { ReactElement, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import QuantitySelect from "../../../../components/QuantitySelect";
import { api } from "../../../../utils/api";
import { useAdminRoute } from "../../../../hooks/useAdminRoute";
import { NextPageWithLayout } from "../../../_app";
import AdminLayout from "../../../../components/AdminLayout";

const ProductDetail: NextPageWithLayout = () => {
  useAdminRoute();

  const router = useRouter();
  const [buyAmount, setBuyAmount] = useState(1);
  const product = api.product.findById.useQuery({
    where: {
      id: router.query.id as string,
    },
  });
  return (
    <div className="container">
      {product.isLoading ? (
        <CircularProgress />
      ) : (
        <div className="grid-rows-12 grid w-full grid-cols-2 gap-6">
          <div
            className="col-span-1 col-start-1 row-span-3
         row-start-2 text-xl font-semibold"
          >
            {product.data?.name}
          </div>
          <div className="relative col-span-1 col-start-1 row-start-4">
            <Image
              src={
                product.data?.imgUrl
                  ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${product.data.imgUrl}`
                  : `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/cursed.jpg`
              }
              alt={`${product.data?.id}`}
              height={450}
              width={450}
            />
          </div>
          <div className="col-start-2 row-start-4 flex h-full flex-col">
            <p className="text-lg font-semibold">{product.data?.name}</p>
            <div className="mt-6 h-[50%] line-clamp-12">
              <p className="line-clamp-[12]">{product.data?.description}</p>
            </div>
            <div className="text-lg font-bold">RM {product.data?.price}</div>
            <div className="mt-4 flex items-center">
              <div className="w-[100px]">
                <label className="text-gray-700">Quantity :</label>
              </div>
              <QuantitySelect
                quantity={buyAmount}
                setQuantity={setBuyAmount}
                maxQuantity={product.data?.amount ?? 0}
              />
              <div className="mx-4 text-sm text-gray-600">
                {product.data?.amount} product(s) left
              </div>
            </div>
            <div className="align-center  mt-6">
              <Button
                onClick={() =>
                  router.push(`/admin/products/${router.query.id}/edit`)
                }
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <ProductDetail />
    </AdminLayout>
  );
};

export default ProductDetail;
