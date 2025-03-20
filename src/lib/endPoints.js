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

export const categoryRoute = "categories"

export const orderRoute = "orders"

export const usersRoute = "users"

export const uploadMultiFilesRoute = "uploads/multiple"

export const productRoute = "products"
