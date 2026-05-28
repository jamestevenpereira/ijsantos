interface R2DeleteEnv {
  PORTFOLIO_BUCKET: {
    delete(keys: string | string[]): Promise<void>;
  };
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleDeleteFiles(request: Request, env: R2DeleteEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  if (!env?.PORTFOLIO_BUCKET) {
    console.error("[delete-files] PORTFOLIO_BUCKET binding missing");
    return json({ error: "Storage not configured" }, 500);
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[delete-files] Supabase auth env missing");
    return json({ error: "Auth service not configured" }, 500);
  }

  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return json({ error: "Unauthorized" }, 401);

  const authRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
  if (!authRes.ok) return json({ error: "Unauthorized" }, 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const rawPaths = (body as { paths?: unknown })?.paths;
  const paths = Array.isArray(rawPaths)
    ? rawPaths.filter((p): p is string => typeof p === "string")
    : [];

  if (paths.length > 0) {
    await env.PORTFOLIO_BUCKET.delete(paths);
  }

  return json({ ok: true });
}
