import axiosBase from "axios";

export const BASE_URL = "http://localhost:3035";

// Create main instance with auth interceptors
const axios = axiosBase.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// Use dynamic imports to break circular dependency
axios.interceptors.request.use(async (config) => {
  // Use absolute URL for session fetch
  const session = await fetch(`${process.env.AUTH_URL}/api/auth/session`).then(
    (res) => res.json()
  );

  if (session?.user) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

axios.interceptors.response.use((response) => {
  if (response.data && typeof response.data === "object") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, ...rest } = response.data;
    // If there's only one property in rest, return that
    const values = Object.values(rest);
    response.data = values.length === 1 ? values[0] : rest;
  }
  return response;
});

export default axios;
