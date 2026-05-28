// Cloudflare Pages Function — POST /api/upload
// Env: PORTFOLIO_BUCKET (R2 binding), SUPABASE_URL (var), SUPABASE_SERVICE_ROLE_KEY (secret), VITE_R2_PUBLIC_URL (secret)

interface Env {
  PORTFOLIO_BUCKET: R2Bucket;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  VITE_R2_PUBLIC_URL: string;
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

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json({ error: "Invalid multipart body" }, 400);
  }

  const file = fd.get("file") as File | null;
  const prefix = ((fd.get("prefix") as string | null) ?? "").replace(/[^a-z0-9/_-]/gi, "");

  if (!file || file.size === 0) return json({ error: "Missing file" }, 400);

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${prefix}${crypto.randomUUID()}.${ext}`;

  try {
    await env.PORTFOLIO_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
  } catch (err) {
    console.error("R2 upload error", err);
    return json({ error: "Upload failed" }, 500);
  }

  const url = `${env.VITE_R2_PUBLIC_URL}/${key}`;
  return json({ path: key, url });
};
