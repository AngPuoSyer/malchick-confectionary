import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";

import { NextPage } from "next";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  CardActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { api } from "../../utils/api";
import { debounce } from "lodash";

const sortConfig = [{ createdAt: "desc" }, { price: "asc" }, { price: "desc" }];

const ProductsHome: NextPage = () => {
  const trpcContext = api.useContext();
  const searchRef = useRef<HTMLInputElement>(null);
  const [sortArg, setSortArg] = useState<any>([{ createdAt: "desc" }]);
  const [sortSelect, setSortSelect] = useState(0);
  const [searchString, setSearchString] = useState<string>("");
  const { data: products, isLoading } = api.product.findMany.useQuery(
    {
      orderBy: sortArg,
      where: {
        OR: [
          {
            name: {
              contains: searchString,
            },
          },
          {
            description: {
              contains: searchString,
            },
          },
        ],
      },
    },
    {
      queryKey: ["product.findMany", searchString] as any,
    }
  );

  const onSearchChange = useCallback(
    debounce((e: InputEvent) => {
      setSearchString((e.target as any)?.value);
    }, 800),
    []
  );

  const onSortChange = (e: any) => {
    setSortSelect(e.target.value);
    setSortArg([sortConfig[e.target.value]]);
  };

  return (
    <div className="container">
      <div className="heading my-6 flex items-center justify-between">
        <p>Products</p>
        <div className="flex items-center gap-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Sort By"
              value={sortSelect}
              onChange={onSortChange}
            >
              <MenuItem value={0}>Relavance</MenuItem>
              <MenuItem value={1}>Price: Low to High</MenuItem>
              <MenuItem value={2}>Price: High to Low</MenuItem>
            </Select>
          </FormControl>
          <TextField
            placeholder="Search"
            inputRef={searchRef}
            onChange={onSearchChange}
          ></TextField>
        </div>
      </div>
      <Grid container spacing={2} columns={20}>
        {products &&
          products.map((product, index) => {
            return (
              <Grid item xs={5}>
                <Link href={`/products/${product.id}`}>
                  <Card sx={{ height: 480, borderRadius: 3 }}>
                    <CardHeader
                      disableTypography
                      className="text-lg font-semibold line-clamp-1"
                      title={product.name}
                    ></CardHeader>
                    <CardMedia sx={{ height: 280 }} title={product.name}>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Image
                          src={
                            product.imgUrl
                              ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${product.imgUrl}`
                              : `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/cursed.jpg`
                          }
                          alt={`${product.name} ${index}`}
                          fill
                        />
                      </div>
                    </CardMedia>
                    <CardContent>
                      <span className="line-clamp-3">
                        {product.description}
                      </span>
                    </CardContent>
                    <CardActions>
                      <div className="w-full text-right text-lg font-bold">
                        RM{product.price.toFixed(2)}
                      </div>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default ProductsHome;
