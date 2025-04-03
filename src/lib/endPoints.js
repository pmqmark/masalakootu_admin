export let BASE_URL = "";

const is_development = true;

if (is_development) {
  BASE_URL = "http://localhost:8080/api/";
} else {
  BASE_URL = "https://server.masalakoottu.com/api/";
}

// Login Routes
export const loginAuth = "auth/login";

// Products
export const getAllProducts = "products/all";
export const archiveStatus = "products";
export const productRoute = "products";

// Category API
export const categoryRoute = "categories";
export const archiveCategory = "categories"; // <=:id

// Order API
export const orderRoute = "orders";

// User API
export const usersRoute = "users";
export const usersBlockRoute = "users"; //id
export const getAUserRoute = "users"; //id
export const getAddress = "users/addresses"; //id

// Common API
export const uploadMultiFilesRoute = "uploads/multiple";
export const uploadSingleFilesRoute = "uploads/single";

// dashboard metrics
export const getAllMetrics = "dashboard/metrics";
export const getOrderStatus = "dashboard/order-status-count";
export const getRecentOrder = "dashboard/recent-orders";
export const getSaleAnalytics = "dashboard/sale-analytics"
export const bestProdsRoute = "dashboard/best-selling-product"

export const dashboardRoute = "dashboard";

export const regenTokenRoute = "auth/regenerate-token"

export const zoneRoute = "zones";

export const chargeRoute = "charges";
