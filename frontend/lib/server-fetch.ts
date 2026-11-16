import "server-only";

import { getServerAuth } from "./server-auth";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5001"}/api`;

type FetchOptions = Omit<RequestInit, "body"> & {
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
};

export class ServerFetchError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ServerFetchError";
  }
}

export async function serverFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const auth = await getServerAuth();
  if (!auth) throw new ServerFetchError(401, "Not authenticated");

  const { searchParams, body, headers, ...rest } = options;

  let url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  if (searchParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null || value === "") continue;
      params.set(key, String(value));
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ServerFetchError(res.status, `${res.status} ${res.statusText} on ${path}`);
  }

  return (await res.json()) as T;
}
