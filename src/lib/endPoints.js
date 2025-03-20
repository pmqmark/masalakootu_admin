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
