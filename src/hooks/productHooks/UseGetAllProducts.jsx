import  { useEffect, useState } from "react";
import { getAllProducts } from "../../lib/endPoints";
import useAxiosPrivate from "../useAxiosPrivate";

export const UseGetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [productsloading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const fetechProducts = async () => {
    setProductsLoading(true);
    setError(null);
    try {
        const res = await axiosPrivate.get(getAllProducts);
      console.log(res.data, "get all products");
      setProducts(res?.data?.data?.result);
    } catch (error) {
      setError(error.message || "Failed to fetch Products");
    } finally {
      setProductsLoading(false);
    }
  };
  useEffect(() => {
   fetechProducts();
  }, [])
  
  return {products , productsloading,error ,refetch :fetechProducts};
};
