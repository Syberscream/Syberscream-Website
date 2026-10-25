// SyberScream site worker.
// Serves the static site, plus a tiny API for the client rotator:
//   GET  /api/clients   public  — the rotator settings and client list
//   POST /api/login     admin   — checks the password
//   PUT  /api/clients   admin   — saves the rotator settings and client list
// Admin requests send the password as "Authorization: Bearer <password>".
// The password is the ADMIN_PASSWORD secret set in the Cloudflare dashboard.

const KEY = "clients";

const DEFAULTS = {
  heading: "Some of our clients",
  speed: 40,            // seconds for one full loop
  direction: "left",    // "left" or "right"
  pauseOnHover: true,
  clients: [
    "Co-op", "Denny's", "KFC", "Mac's", "Northern Savings", "Petro-Canada", "Save-On-Foods",
    "Sobeys", "TD Bank", "Canada Post", "Scotiabank", "Walmart", "BC Liquor Distribution", "McDonald's",
  ].map((name) => ({ name, url: "", logo: "", hidden: false })),
};

const LIMITS = { clients: 80, name: 80, heading: 80, url: 300, logo: 200_000, body: 4_000_000 };
const LOGO_RE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(request, env, url);
      } catch (err) {
        return json({ error: "Something went wrong." }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

async function api(request, env, url) {
  const route = `${request.method} ${url.pathname}`;

  if (route === "GET /api/clients") {
    return json(await load(env), 200, { "Cache-Control": "no-cache" });
  }

  if (route === "POST /api/login") {
    const denied = await checkAuth(request, env);
    return denied || json({ ok: true });
  }

  if (route === "PUT /api/clients") {
    const denied = await checkAuth(request, env);
    if (denied) return denied;
    const len = Number(request.headers.get("Content-Length") || 0);
    if (len > LIMITS.body) return json({ error: "That's too much data. Try smaller logos." }, 413);
    let body;
    try { body = await request.json(); } catch { return json({ error: "Couldn't read the data sent." }, 400); }
    const result = clean(body);
    if (result.error) return json({ error: result.error }, 400);
    result.data.updatedAt = new Date().toISOString();
    await env.SITE_KV.put(KEY, JSON.stringify(result.data));
    return json(result.data);
  }

  return json({ error: "Not found." }, 404);
}

async function load(env) {
  const saved = env.SITE_KV ? await env.SITE_KV.get(KEY, "json") : null;
  return saved || DEFAULTS;
}

async function checkAuth(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return json({ error: "No admin password is set yet. Add the ADMIN_PASSWORD secret in Cloudflare." }, 503);
  }
  if (!env.SITE_KV) return json({ error: "Storage isn't connected to this site yet." }, 503);
  const header = request.headers.get("Authorization") || "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!(await same(given, env.ADMIN_PASSWORD))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return json({ error: "Wrong password." }, 401);
  }
  return null;
}

// Compare two strings without leaking where they differ.
async function same(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const x = new Uint8Array(ha), y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function clean(body) {
  if (!body || typeof body !== "object") return { error: "Couldn't read the data sent." };
  const heading = str(body.heading, LIMITS.heading) || DEFAULTS.heading;
  const speed = Math.round(Number(body.speed));
  if (!(speed >= 10 && speed <= 120)) return { error: "Speed must be between 10 and 120 seconds." };
  const direction = body.direction === "right" ? "right" : "left";
  const pauseOnHover = body.pauseOnHover !== false;
  if (!Array.isArray(body.clients)) return { error: "The client list is missing." };
  if (body.clients.length > LIMITS.clients) return { error: `Up to ${LIMITS.clients} clients, please.` };

  const clients = [];
  for (const c of body.clients) {
    const name = str(c && c.name, LIMITS.name);
    if (!name) return { error: "Every client needs a name." };
    let link = str(c.url, LIMITS.url);
    if (link && !/^https?:\/\/[^\s]+$/i.test(link)) return { error: `The link for "${name}" must start with http:// or https://.` };
    const logo = typeof c.logo === "string" ? c.logo : "";
    if (logo && (!LOGO_RE.test(logo) || logo.length > LIMITS.logo)) {
      return { error: `The logo for "${name}" isn't a supported image, or it's too large.` };
    }
    clients.push({ name, url: link, logo, hidden: c.hidden === true });
  }
  return { data: { heading, speed, direction, pauseOnHover, clients } };
}

function str(v, max) {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}
