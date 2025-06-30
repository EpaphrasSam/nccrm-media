import { env } from "next-runtime-env";

export const clientEnv = {
  apiUrl: env("NEXT_PUBLIC_API_URL"),
  authUrl: env("NEXT_PUBLIC_AUTH_URL"),
};

// Server-only environment variables - using process.env
export const serverEnv = {
  apiUrl: process.env.API_URL,
  serverApiUrl: process.env.SERVER_API_URL,
  authSecret: process.env.AUTH_SECRET,
  powerbiEmbedUrl: process.env.POWERBI_EMBED_URL,
  authUrl: process.env.AUTH_URL,
};

export const getApiUrl = () => {
  if (typeof window === "undefined") {
    return serverEnv.apiUrl;
  }
  return clientEnv.apiUrl;
};

export const getAuthUrl = () => {
  if (typeof window === "undefined") {
    return serverEnv.authUrl;
  }
  return clientEnv.authUrl;
};
