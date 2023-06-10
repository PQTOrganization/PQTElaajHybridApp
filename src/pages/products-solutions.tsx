import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { useErrorContext } from "../context/errorcontext";

import GridDX from "../components/layout/griddx";
import ProductsSolutionsImage from "../components/business/productsolutionimages";

import { getProductServices } from "../shared/services/commonservice";
import { useAuthContext } from "../context/authcontext";

const ProductsSolutions = () => {
  const { getToken } = useAuthContext();
  const { setError } = useErrorContext();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any>();

  useEffect(() => {
    const token = getToken();
    getProductServices(token)
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const productSolution = (x: String) => {
    if (loading)
      return (
        <Skeleton
          containerClassName="skeleton-container"
          count={4}
          style={{ height: 150, marginBottom: 8 }}
        />
      );
    else {
      const product = products?.filter((c: any) => c.businessLine == x);
      return product && <ProductsSolutionsImage data={product} title={x} />;
    }
  };

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start" }}
      rowSpacing={4}
    >
      <GridDX item xs={12}>
        {productSolution("General Takaful Product")}
      </GridDX>
      <GridDX item xs={12}>
        {productSolution("Corporate Takaful Product")}
      </GridDX>
      <GridDX item xs={12}>
        {productSolution("Individual")}
      </GridDX>
    </GridDX>
  );
};

export default ProductsSolutions;
