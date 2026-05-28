interface R2UploadEnv {
  PORTFOLIO_BUCKET: {
    put(
      key: string,
      value: ReadableStream | ArrayBuffer | Blob,
      options?: { httpMetadata?: { contentType?: string } },
    ): Promise<unknown>;
  };
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  VITE_R2_PUBLIC_URL: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleUpload(request: Request, env: R2UploadEnv): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return json({ error: "Unauthorized" }, 401);

  const authRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
  if (!authRes.ok) return json({ error: "Unauthorized" }, 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid form data" }, 400);
  }

  const file = form.get("file") as File | null;
  if (!file) return json({ error: "Missing file" }, 400);

  const rawPrefix = (form.get("prefix") as string | null) ?? "";
  const prefix = rawPrefix.replace(/[^a-z0-9/_-]/gi, "");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const key = `${prefix}${crypto.randomUUID()}.${ext}`;

  await env.PORTFOLIO_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  const url = `${env.VITE_R2_PUBLIC_URL}/${key}`;
  return json({ path: key, url });
}
