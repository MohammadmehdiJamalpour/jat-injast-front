import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { proxyMapIrSearch } from "./_proxy";

const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, ORIGINAL_ENV);
}

function postRequest(body, headers = { "content-type": "application/json" }) {
  return new Request("http://localhost/api/map-ir/search", {
    method: "POST",
    headers,
    body,
  });
}

describe("proxyMapIrSearch", () => {
  beforeEach(() => {
    restoreEnv();
    vi.stubGlobal("fetch", vi.fn());
    delete process.env.MAPIR_API_KEY;
    delete process.env.NEXT_PUBLIC_MAPIR_API_KEY;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreEnv();
  });

  it("fails safely when the server-only Map.ir key is missing", async () => {
    process.env.NEXT_PUBLIC_MAPIR_API_KEY = "public-key-should-not-be-used";

    const response = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "Tehran" })),
    );

    await expect(response.json()).resolves.toEqual({
      detail: "Map.ir API key is not configured.",
    });
    expect(response.status).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects invalid JSON without calling Map.ir", async () => {
    process.env.MAPIR_API_KEY = "server-key";

    const response = await proxyMapIrSearch(postRequest("{invalid json"));

    await expect(response.json()).resolves.toEqual({
      detail: "Invalid JSON body.",
    });
    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects unsupported route suffixes before reading the request body", async () => {
    process.env.MAPIR_API_KEY = "server-key";

    const response = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "Tehran" })),
      "/reverse",
    );

    await expect(response.json()).resolves.toEqual({
      detail: "Unsupported Map.ir route.",
    });
    expect(response.status).toBe(404);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects non-JSON request bodies", async () => {
    process.env.MAPIR_API_KEY = "server-key";

    const response = await proxyMapIrSearch(
      postRequest("text=Tehran", { "content-type": "text/plain" }),
    );

    await expect(response.json()).resolves.toEqual({
      detail: "Request body must be JSON.",
    });
    expect(response.status).toBe(415);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects empty and oversized request bodies", async () => {
    process.env.MAPIR_API_KEY = "server-key";

    const emptyResponse = await proxyMapIrSearch(postRequest("   "));
    const largeResponse = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "a".repeat(33_000) })),
    );

    await expect(emptyResponse.json()).resolves.toEqual({
      detail: "JSON body is required.",
    });
    await expect(largeResponse.json()).resolves.toEqual({
      detail: "Request body is too large.",
    });
    expect(emptyResponse.status).toBe(400);
    expect(largeResponse.status).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects invalid payload shapes and coordinates", async () => {
    process.env.MAPIR_API_KEY = "server-key";

    const listResponse = await proxyMapIrSearch(postRequest(JSON.stringify([])));
    const textResponse = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "" })),
    );
    const coordinateResponse = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "Tehran", lat: "north" })),
    );

    await expect(listResponse.json()).resolves.toEqual({
      detail: "JSON body must be an object.",
    });
    await expect(textResponse.json()).resolves.toEqual({
      detail: "text is required.",
    });
    await expect(coordinateResponse.json()).resolves.toEqual({
      detail: "lat must be a number.",
    });
    expect(listResponse.status).toBe(400);
    expect(textResponse.status).toBe(400);
    expect(coordinateResponse.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("fails safely when the configured Map.ir base URL is invalid", async () => {
    process.env.MAPIR_API_KEY = "server-key";
    process.env.MAPIR_BASE_URL = "file:///tmp/mapir";

    const response = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "Tehran" })),
    );

    await expect(response.json()).resolves.toEqual({
      detail: "Map.ir base URL is not configured correctly.",
    });
    expect(response.status).toBe(500);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("maps upstream network failures to a bad gateway response", async () => {
    process.env.MAPIR_API_KEY = "server-key";
    fetch.mockRejectedValue(new Error("network unavailable"));

    const response = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "Tehran" })),
    );

    await expect(response.json()).resolves.toEqual({
      detail: "Map.ir service is not reachable.",
    });
    expect(response.status).toBe(502);
  });

  it("maps upstream server failures to a bad gateway response", async () => {
    process.env.MAPIR_API_KEY = "server-key";
    fetch.mockResolvedValue(
      new Response(JSON.stringify({ detail: "upstream failed" }), {
        status: 503,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "Tehran" })),
    );

    await expect(response.json()).resolves.toEqual({
      detail: "Map.ir request failed.",
    });
    expect(response.status).toBe(502);
  });

  it("preserves upstream client failure status codes", async () => {
    process.env.MAPIR_API_KEY = "server-key";
    fetch.mockResolvedValue(
      new Response(JSON.stringify({ detail: "bad query" }), {
        status: 422,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await proxyMapIrSearch(
      postRequest(JSON.stringify({ text: "Tehran" })),
    );

    await expect(response.json()).resolves.toEqual({
      detail: "Map.ir request failed.",
    });
    expect(response.status).toBe(422);
  });

  it("normalizes and forwards only supported payload fields", async () => {
    process.env.MAPIR_API_KEY = "server-key";
    fetch.mockResolvedValue(
      new Response(JSON.stringify({ value: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await proxyMapIrSearch(
      postRequest(
        JSON.stringify({
          text: " Tehran ",
          lat: "35.7",
          lon: "51.4",
          ignored: "field",
        }),
      ),
    );

    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "https://map.ir/search/v2",
      expect.objectContaining({
        body: JSON.stringify({
          text: "Tehran",
          lat: 35.7,
          lon: 51.4,
        }),
        headers: expect.objectContaining({
          "x-api-key": "server-key",
        }),
      }),
    );
  });
});
