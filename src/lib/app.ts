export const APP_NAME = "Diagnostic Decision Lab";
export const APP_TAGLINE = "What should I learn next?";

/** Public asset URL that respects Vite `base` (GitHub Pages project path). */
export function publicUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}${path.replace(/^\//, "")}`;
}

/** TanStack Router basepath from Vite `BASE_URL` (`/` in preview). */
export function routerBasepath() {
  const base = import.meta.env.BASE_URL || "/";
  const trimmed = base.replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/";
}
