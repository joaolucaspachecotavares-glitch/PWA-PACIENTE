/** Destino interno seguro (`?proximo=`, `?continuar=`); qualquer outra coisa vira `fallback`. */
export function safeInternalPath(value: string | null | undefined, fallback: string): string {
  // Espaços, controles e `\` são normalizados pelo parser de URL e podem levar a outro host.
  if (!value || !value.startsWith("/") || /[\s\\\u0000-\u001f\u007f]/.test(value)) return fallback;
  const base = "http://app.invalid";
  const url = new URL(value, base);
  return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : fallback;
}
