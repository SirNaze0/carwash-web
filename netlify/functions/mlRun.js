exports.handler = async (event) => {
  try {
    const backendUrl = process.env.BACKEND_URL; // https://carwash-backend-nq39.onrender.com
    const mlKey = process.env.ML_KEY;           // igual que en Render
    if (!backendUrl || !mlKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing BACKEND_URL or ML_KEY env vars" }),
      };
    }

    let body = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (_) {
      body = {};
    }

    const deviceId = body.deviceId || "carwash-01";
    const contamination = (body.contamination ?? 0.05);

    const url =
      `${backendUrl}/api/ml/run` +
      `?deviceId=${encodeURIComponent(deviceId)}` +
      `&contamination=${encodeURIComponent(contamination)}`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "X-ML-KEY": mlKey,
      },
    });

    const text = await r.text();
    return {
      statusCode: r.status,
      headers: { "Content-Type": "application/json" },
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: e.message }),
    };
  }
};