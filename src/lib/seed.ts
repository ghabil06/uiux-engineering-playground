/** Deterministic pseudo-random helper — leaf module (no imports) so registries can share it without import cycles. */
export function seeded(n: number): number {
  const x = Math.sin(n * 999 + 7) * 10000;
  return x - Math.floor(x);
}
