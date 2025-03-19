import axios from "axios";
import { BASE_URL } from "../lib/endPoints";

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});
