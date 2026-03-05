export default async (request) => {
  try {
    const payload = await request.json();

    const backendUrl = process.env.BACKEND_URL; // https://carwash-backend-nq39.onrender.com
    const ingestKey = process.env.INGEST_KEY;   // super_clave_segura_123

    if (!backendUrl || !ingestKey) {
      return new Response(
        JSON.stringify({ error: "Missing BACKEND_URL or INGEST_KEY env vars" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const r = await fetch(`${backendUrl}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-INGEST-KEY": ingestKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text();

    // Devuelve tal cual lo que responda el backend
    return new Response(text, {
      status: r.status,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};