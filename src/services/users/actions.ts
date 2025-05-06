"use server";

import { auth } from "@/utils/auth";
import { getBaseUrl } from "@/utils/fetch-client";

export async function serverFetchUser() {
  const session = await auth();
  const res = await fetch(`${getBaseUrl()}/get-user/${session?.user?.id}`, {
    method: "GET",
    headers: { Authorization: session?.user?.token || "" },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    return undefined;
  }

  const data = await res.json();
  return data.user;
}
