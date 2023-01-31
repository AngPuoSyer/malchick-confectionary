import Button from "@mui/material/Button";

export interface QuantitySelectProps extends React.ComponentProps<any> {
  quantity: number;
  setQuantity: (value: (value: number) => number) => void;
  maxQuantity: number;
}

const QuantitySelect = ({
  quantity,
  setQuantity,
  maxQuantity,
}: QuantitySelectProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outlined"
        className="text-4xl"
        size="large"
        disabled={quantity === 1}
        onClick={() => setQuantity((quantity) => quantity - 1)}
      >
        -
      </Button>
      <div className="mx-4">{quantity}</div>
      <Button
        variant="outlined"
        className="text-4xl"
        size="large"
        onClick={() => {
          setQuantity((quan: number) => quan + 1);
        }}
        disabled={quantity === maxQuantity}
      >
        +
      </Button>
    </div>
  );
};

export default QuantitySelect;
