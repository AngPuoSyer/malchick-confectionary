import { NextPage } from "next";
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  Snackbar,
  TextField,
} from "@mui/material";
import CartItem from "../../components/CartItem";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { CartProduct, Product } from "@prisma/client";

const CartPage: NextPage = () => {
  const [selected, setSelected] = useState(new Map());
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const trpcContext = api.useContext();

  const cart = api.cart.findUserCart.useQuery();
  const checkoutCartMutation = api.cart.checkoutCart.useMutation({
    onSuccess: () => {
      setSnackBarOpen(true);
      setSelected(new Map());
      trpcContext.cart.findUserCart.invalidate();
    },
  });

  const onCheckBox = (checked: boolean, product: any) => {
    if (checked) {
      setSelected((a) => new Map(a.set(product.productId, product)));
    } else {
      setSelected((a) => {
        a.delete(product.productId);
        return new Map(a);
      });
    }
  };
  const onCheckAll = (checked: boolean) => {
    if (checked) {
      const newMap = new Map();
      cart.data?.cartProduct.forEach((e) => {
        newMap.set(e.productId, e);
      });
      setSelected(newMap);
    } else {
      setSelected(new Map());
    }
  };

  const total = [...selected.values()]
    .reduce((total: number, value: CartProduct) => {
      return total + ((value as any).product as Product).price * value.amount;
    }, 0)
    .toFixed(2);

  const checkoutCart = () => {
    checkoutCartMutation.mutate({
      cartProduct: [...selected.values()].map((product) => {
        return {
          id: product.productId,
          amount: product.amount,
        };
      }),
      totalPaid: +total,
    });
  };

  return (
    <div className="container ">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackBarOpen(false)}
        message="Successfully Purchased Products"
      >
        <Alert
          onClose={() => setSnackBarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          <AlertTitle>Success</AlertTitle>
        </Alert>
      </Snackbar>
      <div className="mt-10 mb-4 overflow-y-auto">
        {cart.data &&
          cart.data.cartProduct.map((cartProduct) => (
            <>
              <CartItem
                className="mb-4"
                cartProduct={cartProduct}
                setSelected={onCheckBox}
                checked={!!selected.get(cartProduct.productId)}
              />
              <div className="h-[20px]"></div>
            </>
          ))}
      </div>
      <div className="sticky bottom-0 -left-2 flex h-[8vh] w-full items-center justify-between border-t bg-white">
        <div className="flex items-center">
          <Checkbox
            onChange={(e) => onCheckAll(e.target.checked)}
            defaultChecked={false}
          ></Checkbox>
          <p>{selected.size} items selected</p>
        </div>
        <div className="flex items-center gap-10">
          <p className="text-lg font-semibold">
            RM
            {total}
          </p>
          <Button
            variant="outlined"
            onClick={checkoutCart}
            disabled={checkoutCartMutation.isLoading}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
