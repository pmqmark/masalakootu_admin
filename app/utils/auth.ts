import axios from "axios";
import { baseUrl, regenerateRoute } from "./Endpoint";

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token) => localStorage.setItem("token", token);

export const regenerateToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token found. Please log in again.");
    }

    const response = await axios.post(`${baseUrl}${regenerateRoute}`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (response.data.success) {
      const newToken = response.data.token;
      setAuthToken(newToken);
      return newToken;
    } else {
      throw new Error("Failed to regenerate token");
    }
  } catch (error) {
    console.error("Token regeneration error:", error.message);
    return null;
  }
};
