import { createClient } from "@libsql/client";
import { fetch } from "undici";

export const db = createClient({
  fetch,
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
