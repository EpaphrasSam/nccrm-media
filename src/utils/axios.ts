import axiosBase from "axios";

// In browser, only NEXT_PUBLIC_ vars are available
export const BASE_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://api:3035";

// Prioritize NEXT_PUBLIC_ for browser environment
const authUrl =
  process.env.AUTH_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "http://localhost:3000";

// Create main instance with auth interceptors
const axios = axiosBase.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Use dynamic imports to break circular dependency
axios.interceptors.request.use(async (config) => {
  try {
    // Ensure we use an absolute URL for session fetch
    const sessionUrl = new URL("/api/auth/session", authUrl).toString();
    const session = await fetch(sessionUrl).then((res) => res.json());

    if (session?.user) {
      config.headers.Authorization = `${session.user.token}`;
    }

    return config;
  } catch (error) {
    console.error("Error fetching session:", error);
    return config;
  }
});

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Use absolute URL for signout
//       await fetch(`${process.env.AUTH_URL}/api/auth/signout`, {
//         method: "POST",
//       });
//       return Response.redirect("/login");
//     }
//     return Promise.reject(error);
//   }
// );

export default axios;
