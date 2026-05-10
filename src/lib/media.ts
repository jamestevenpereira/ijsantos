/** Resolve a local media path from /public, e.g. "portfolio/foo.jpg". */
export function media(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `/${clean}`;
}
