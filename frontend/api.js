// Centralized API helper for authenticated requests
window.apiClient = {
  async request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth && window.supabaseClient) {
      const { data: { session } } = await window.supabaseClient.auth.getSession();
      if (session && session.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    }
    const res = await fetch(path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      let detail;
      try { detail = await res.json(); } catch (_) {}
      throw new Error(detail && detail.error ? detail.error : `Request failed (${res.status})`);
    }
    return res.json();
  }
};