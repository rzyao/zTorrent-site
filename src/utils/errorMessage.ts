export function extractErrorMessage(err: any, fallback: string): string {
  const body = err && (err as any).body;
  const resp = err && (err as any).response;
  const fromBodyData = body && body?.data && (body?.data?.message || body?.data?.msg);
  const fromBodyRoot = body && (body?.message || body?.msg || body?.error_description || body?.error);
  const fromRespData = resp && resp?.data && (resp?.data?.data?.message || resp?.data?.message || resp?.data?.msg);
  const direct = err?.message;
  return (
    fromBodyData || fromBodyRoot || fromRespData || direct || fallback
  );
}
