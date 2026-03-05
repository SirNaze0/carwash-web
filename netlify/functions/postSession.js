export default async (req) => {
  try {
    const payload = JSON.parse(req.body || "{}");

    const backendUrl = process.env.BACKEND_URL; // https://carwash-backend-nq39.onrender.com
    const ingestKey = process.env.INGEST_KEY;   // super_clave_segura_123

    const r = await fetch(`${backendUrl}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-INGEST-KEY": ingestKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text();
    return {
      statusCode: r.status,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};