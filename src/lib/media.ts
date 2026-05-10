/**
 * Media URL helper.
 *
 * Resolves URLs for portfolio photos and videos.
 *
 * - If `VITE_MEDIA_BASE_URL` is defined (e.g. `https://media.ijsantos.pt`),
 *   media is served from that origin (Cloudflare R2 + custom domain recommended).
 * - Otherwise, falls back to local files served from `/public` (current dev setup).
 *
 * To switch to R2:
 *   1. Create an R2 bucket on Cloudflare (e.g. `ijsantos-media`).
 *   2. Connect a custom domain (e.g. `media.ijsantos.pt`) — free on R2.
 *   3. Upload `public/portfolio/` and `public/videos/` to the bucket
 *      (preserving paths: `portfolio/...`, `videos/...`).
 *   4. Set the env var `VITE_MEDIA_BASE_URL=https://media.ijsantos.pt`
 *      in the project / deployment.
 *   5. Delete the local copies from `public/` to slim the Worker bundle.
 */
const RAW_BASE = import.meta.env.VITE_MEDIA_BASE_URL as string | undefined;
const BASE = RAW_BASE ? RAW_BASE.replace(/\/+$/, "") : "";

/** Resolve a media path (e.g. "portfolio/foo.jpg") to a fully-qualified URL. */
export function media(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return BASE ? `${BASE}/${clean}` : `/${clean}`;
}
