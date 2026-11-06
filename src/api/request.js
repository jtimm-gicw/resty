// Browser-side HTTP helper (Phase 3). Keep networking separate from React.
export function validateRequest(draft) {
  let url;
  try { url = new URL(draft.url.trim()); } catch (_) { throw new Error('Enter a valid API URL.'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Use an HTTP or HTTPS URL.');
  const method = draft.method.toUpperCase();
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) throw new Error('Choose a valid HTTP method.');
  let body = null;
  if (['POST', 'PUT', 'PATCH'].includes(method) && draft.body.trim()) {
    try { body = JSON.parse(draft.body); } catch (_) { throw new Error('Request body must contain valid JSON.'); }
  }
  return { method, url: url.toString(), body };
}

export async function sendRequest(request, signal) {
  const options = { method: request.method, signal, headers: { Accept: 'application/json' } };
  if (request.body !== null) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(request.body);
  }
  const response = await fetch(request.url, options);
  const raw = await response.text(); // Works with JSON, text, 204 No Content and failed responses.
  let data = null;
  if (raw) {
    try { data = JSON.parse(raw); } catch (_) { data = raw; }
  }
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    data, // Keep the COMPLETE JSON object, including pagination fields.
  };
}
