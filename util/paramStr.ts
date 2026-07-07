/** Express `req.params` values may be `string[]` for splat routes; normalize for Prisma/SQL. */
export function paramStr(v: string | string[] | undefined): string {
  if (v == null) return "";
  return Array.isArray(v) ? (v[0] ?? "") : v;
}
