/* thedailyguru Cloudflare Worker — serves the built Luminae app (./dist via
   the ASSETS binding) and proxies AI calls through /api/luminae so the
   Anthropic key lives ONLY as a Worker secret, never in the browser bundle.
   Set the secret once with:  npx wrangler secret put ANTHROPIC_API_KEY  */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/luminae" && request.method === "POST") {
      return handleLuminae(request, env);
    }
    const res = await env.ASSETS.fetch(request);
    const ct = res.headers.get("Content-Type") || "";
    // The ASSETS binding ignores Range requests (returns the whole file), which
    // breaks the audio seek bar. Add HTTP range support for audio so players can seek.
    if (res.status === 200 && ct.startsWith("audio")) {
      const range = request.headers.get("Range");
      if (!range) {
        const headers = new Headers(res.headers);
        headers.set("Accept-Ranges", "bytes");
        return new Response(res.body, { status: 200, headers });
      }
      const buf = await res.arrayBuffer();
      const total = buf.byteLength;
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] !== "" ? parseInt(m[1], 10) : 0;
      let end = m && m[2] !== "" ? parseInt(m[2], 10) : total - 1;
      if (!Number.isFinite(start) || start < 0 || start >= total) start = 0;
      if (!Number.isFinite(end) || end >= total) end = total - 1;
      if (end < start) end = total - 1;
      const chunk = buf.slice(start, end + 1);
      const headers = new Headers(res.headers);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
      headers.set("Content-Length", String(chunk.byteLength));
      return new Response(chunk, { status: 206, statusText: "Partial Content", headers });
    }
    return res;
  },
};

async function handleLuminae(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "Server is missing ANTHROPIC_API_KEY." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
