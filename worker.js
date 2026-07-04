export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/luminae" && request.method === "POST") {
      return handleLuminae(request, env);
    }
    return env.ASSETS.fetch(request);
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
