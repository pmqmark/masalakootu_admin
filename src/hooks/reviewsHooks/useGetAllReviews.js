import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../useAxiosPrivate';
import { getAllReviews } from '../../lib/endPoints';

const useGetAllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosPrivate.get(getAllReviews);
            console.log(res.data, "get all reviews");
            setReviews(res?.data?.data?.result);
        } catch (error) {
            setError(error.message || "Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return { reviews, loading, error, refetch: fetchReviews };
};

export default useGetAllReviews;
