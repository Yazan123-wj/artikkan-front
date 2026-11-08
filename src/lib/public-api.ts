type Json = Record<string, unknown>;

type ErrorBody = {
  error?: { message?: string };
};

export async function postPublicJson<T>(url: string, body: Json): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as T & ErrorBody;
  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Request failed');
  }
  return data;
}
