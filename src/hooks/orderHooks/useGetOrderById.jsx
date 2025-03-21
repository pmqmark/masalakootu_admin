import { useState, useEffect } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import { orderRoute } from "../../lib/endPoints";

export const useGetOrderById = (Id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchOrderById = async () => {
    if (!Id) return; // Prevent API call if Id is not provided
console.log(Id)
    setLoading(true);
    setError(null);
    try {
      const res = await axiosPrivate.get(`${orderRoute}/${Id}`);
      console.log(res.data, "Fetched Order data");
      setOrder(res?.data?.data?.order || null);
    } catch (error) {
      setError(error.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderById();
  }, [Id]); // Re-fetch when Id changes

  return { order, loading, error, setOrder, refetch: fetchOrderById };
};
