import { Box, Button, Checkbox } from "@mui/material";
import { CartProduct, Product } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { api } from "../utils/api";
import DeleteCartDialog from "./DeleteCartDialog";

export interface CartItemProps extends React.ComponentProps<any> {
  cartProduct: CartProduct;
  setSelected: any;
  checked: boolean;
}

// TODO: delete product, set selected
const CartItem = (props: CartItemProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const trpcContext = api.useContext();
  const deleteCartProductMutation = api.cart.deleteCartProduct.useMutation({
    onSuccess: () => {
      trpcContext.cart.findUserCart.invalidate();
    },
  });
  return (
    <div className="mx-auto w-11/12 rounded-lg border border-gray-400">
      <DeleteCartDialog
        onClose={() => setDeleteDialogOpen(true)}
        open={deleteDialogOpen}
        proudctName={((props.cartProduct as any).product as Product)?.name}
        onItemDelete={() => {
          deleteCartProductMutation.mutate({ id: props.cartProduct.productId });
          setDeleteDialogOpen(false);
        }}
      />
      <div className="flex justify-between">
        <div className="my-6 flex w-10/12 items-center gap-4">
          <Checkbox
            className="p-4"
            onChange={(e) => {
              props.setSelected(e.target.checked, props.cartProduct);
            }}
            checked={props.checked}
          />
          <div className="relative mx-6 h-[200px] w-[200px]">
            <Image
              alt="alskdf"
              fill
              src={
                ((props.cartProduct as any).product as Product)?.imgUrl
                  ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${
                      ((props.cartProduct as any).product as Product)?.imgUrl
                    }`
                  : `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/cursed.jpg`
              }
              className="cover mx-auto"
            />
          </div>
          <div className="grid w-full grid-rows-3 gap-10">
            <h3>
              Name: {((props.cartProduct as any).product as Product).name}
            </h3>
            <h4>Quantity: {props.cartProduct.amount}</h4>
            <div className="flex w-full justify-between">
              <p>RM: {((props.cartProduct as any).product as Product).price}</p>
              <p className="text-lg font-semibold">
                Total: RM{" "}
                {(
                  ((props.cartProduct as any).product as Product).price *
                  props.cartProduct.amount
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <Button
          className=""
          sx={{ padding: "2rem" }}
          color="error"
          disabled={deleteCartProductMutation.isLoading}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
