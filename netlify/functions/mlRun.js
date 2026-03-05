export default async (request) => {
  try {
    const body = await request.json().catch(() => ({}));
    const deviceId = body.deviceId || "carwash-01";
    const contamination = body.contamination ?? 0.05;

    const backendUrl = process.env.BACKEND_URL; // https://carwash-backend-nq39.onrender.com
    const mlKey = process.env.ML_KEY;           // clave secreta (solo server)

    if (!backendUrl || !mlKey) {
      return new Response(
        JSON.stringify({ error: "Missing BACKEND_URL or ML_KEY env vars" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const url = `${backendUrl}/api/ml/run?deviceId=${encodeURIComponent(deviceId)}&contamination=${encodeURIComponent(contamination)}`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "X-ML-KEY": mlKey,
      },
    });

    const text = await r.text();
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