// Cloudflare Pages Function — POST /api/delete-files
// Env: PORTFOLIO_BUCKET (R2 binding), SUPABASE_URL (var), SUPABASE_SERVICE_ROLE_KEY (secret)

interface Env {
  PORTFOLIO_BUCKET: R2Bucket;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

async function validateJwt(request: Request, env: Env): Promise<boolean> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "").trim();
  if (!token) return false;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
  return res.ok;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await validateJwt(request, env))) {
    return new Response("Unauthorized", { status: 401 });
  }

  let paths: string[];
  try {
    const body = await request.json<{ paths: unknown }>();
    if (!Array.isArray(body.paths) || body.paths.some((p) => typeof p !== "string")) {
      return json({ error: "paths must be string[]" }, 400);
    }
    paths = body.paths as string[];
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (paths.length === 0) return json({ ok: true });

  try {
    await env.PORTFOLIO_BUCKET.delete(paths);
  } catch (err) {
    console.error("R2 delete error", err);
    return json({ error: "Delete failed" }, 500);
  }

  return json({ ok: true });
};
