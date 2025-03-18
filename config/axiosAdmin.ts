import axios from 'axios';
 
// config
export let AGENT_API = '';
 
const is_development = true;
 
if (is_development) {
  AGENT_API = 'http://localhost:8080/api/';
} else {
  AGENT_API = '';
}
 
// ----------------------------------------------------------------------
const axiosAdmin = axios.create({
  withCredentials: true,
  baseURL: AGENT_API
});
 
 
// Function to refresh the access token
const refreshAccessToken = async () => {
 
  try {
    const rt = localStorage.getItem('refreshToken');
    if (!rt) {
      throw new Error('No refresh token available');
    }
 
    const response = await axios.post(
      `${AGENT_API}auth/regenerate-token`,
      { refreshToken: rt },
      { withCredentials: true }
    );
 
    const { accessToken, refreshToken} = response.data.data;
 
 
    console.log(response?.data);
 
    console.log(localStorage.getItem("userInfo"))
    const user = {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem("userInfo", JSON.stringify(user));
 
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};
 
axiosAdmin.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Response interceptor to handle token refresh logic
axiosAdmin.interceptors.response.use(
 
  (response) => response,
  async (error) => {
 
    const originalRequest = error.config;
 
    // Check if the error is due to an expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
 
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosAdmin(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // If refresh token fails, log the user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        // window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
 
    // If the error is not a 401 or the refresh token logic fails, reject the promise
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);
 
export { axiosAdmin };