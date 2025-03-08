import axiosBase from "axios";

export const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

const authUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_AUTH_URL;

// Create main instance with auth interceptors
const axios = axiosBase.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Use dynamic imports to break circular dependency
axios.interceptors.request.use(async (config) => {
  // Use absolute URL for session fetch
  const session = await fetch(`${authUrl}/api/auth/session`).then((res) =>
    res.json()
  );

  if (session?.user) {
    config.headers.Authorization = `${session.user.token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Use absolute URL for signout
      await fetch(`${process.env.AUTH_URL}/api/auth/signout`, {
        method: "POST",
      });
      return Response.redirect("/login");
    }
    return Promise.reject(error);
  }
);

export default axios;
