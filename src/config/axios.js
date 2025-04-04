import axios from "axios";
import { BASE_URL } from "../lib/endPoints";

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});


export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});