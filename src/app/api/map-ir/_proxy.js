function getMapIrApiKey() {
  return (
    process.env.MAPIR_API_KEY ||
    process.env.NEXT_PUBLIC_MAPIR_API_KEY ||
    ""
  ).trim();
}

function getMapIrBaseUrl() {
  return (
    process.env.MAPIR_BASE_URL ||
    process.env.NEXT_PUBLIC_MAPIR_BASE_URL ||
    "https://map.ir"
  ).replace(/\/+$/, "");
}

export async function proxyMapIrSearch(request, suffix = "") {
  const apiKey = getMapIrApiKey();

  if (!apiKey) {
    return Response.json(
      { detail: "Map.ir API key is not configured." },
      { status: 500 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ detail: "Invalid JSON body." }, { status: 400 });
  }

  let response;

  try {
    response = await fetch(`${getMapIrBaseUrl()}/search/v2${suffix}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { detail: "Map.ir service is not reachable." },
      { status: 502 },
    );
  }

  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") || "application/json",
    },
  });
}
