export function toErrorMessage(
  err: unknown,
  fallback = 'Não foi possível carregar os dados.'
): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string' && err.length > 0) return err;
  return fallback;
}