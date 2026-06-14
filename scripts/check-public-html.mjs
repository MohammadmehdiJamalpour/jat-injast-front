import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const configuredBaseUrl = process.env.PUBLIC_HTML_BASE_URL;
const defaultBaseUrl = "http://127.0.0.1:3000";
const startPort = Number(process.env.PUBLIC_HTML_PORT || 3105);
const houseUuid = process.env.PUBLIC_HTML_HOUSE_UUID;
const startupTimeoutMs = 120_000;
const siteIdentityPatterns = [
  /<link[^>]+rel=["']manifest["'][^>]+href=["']\/manifest\.webmanifest["']/i,
  /<title[^>]*>[\s\S]*\|\s*[^<]*<\/title>/i,
  /<meta[^>]+property=["']og:site_name["'][^>]+content=["'][^"']+["']/i,
];

const routes = [
  { path: "/" },
  { path: "/search" },
  { path: "/about" },
  { path: "/how-become-host" },
  { path: "/terms-of-service" },
  ...(houseUuid ? [{ path: `/house/${houseUuid}` }] : []),
];

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function hasMeaningfulH1(html) {
  const match = html.match(/<h1[\s\S]*?>([\s\S]*?)<\/h1>/i);
  if (!match) return false;
  return normalizeWhitespace(stripTags(match[1])).length >= 4;
}

function hasMetadata(html) {
  return /<title[\s\S]*?>[\s\S]+<\/title>/i.test(html) &&
    /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}["']/i.test(html) &&
    /<link[^>]+rel=["']canonical["'][^>]+href=["']https?:\/\/[^"']+["']/i.test(html);
}

function hasMeaningfulBody(html) {
  const contentBlocks = [...html.matchAll(/<(p|li|dd)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => normalizeWhitespace(stripTags(match[2])))
    .filter((text) => text.length >= 12);
  const combinedBlockText = contentBlocks.join(" ");
  const fullText = normalizeWhitespace(stripTags(html));

  return combinedBlockText.length >= 60 || fullText.length >= 180;
}

async function checkRoute(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route.path}`, {
    headers: { "User-Agent": "jat-injast-public-html-check/1.0" },
  });

  if (!response.ok) {
    throw new Error(`${route.path}: HTTP ${response.status}`);
  }

  const html = await response.text();
  const checks = {
    h1: hasMeaningfulH1(html),
    metadata: hasMetadata(html),
    body: hasMeaningfulBody(html),
  };
  const passed = Object.values(checks).every(Boolean);

  return { ...route, checks, passed };
}

async function targetLooksLikeThisApp(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 750);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "jat-injast-public-html-check/1.0" },
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const html = await response.text();
    return siteIdentityPatterns.some((pattern) => pattern.test(html));
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function hasBuildOutput() {
  return fs.existsSync(path.join(process.cwd(), ".next", "BUILD_ID"));
}

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function findOpenPort() {
  for (let port = startPort; port <= startPort + 94; port += 1) {
    if (await canListen(port)) return port;
  }

  throw new Error(`No open localhost port found from ${startPort} to ${startPort + 94}.`);
}

function stopServer(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForServer(url, child, output) {
  const startedAt = Date.now();
  let exitMessage = "";
  child.once("exit", (code, signal) => {
    exitMessage = `next start exited with code ${code ?? "null"} and signal ${signal ?? "null"}.`;
  });

  while (Date.now() - startedAt < startupTimeoutMs) {
    if (exitMessage) {
      throw new Error(`${exitMessage}\n${output()}`);
    }

    if (await targetLooksLikeThisApp(url)) {
      return;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}.\n${output()}`);
}

async function startBuiltServer() {
  if (!hasBuildOutput()) {
    throw new Error("Missing .next build output. Run `npm run build` before `npm run seo:html`.");
  }

  const port = await findOpenPort();
  const url = `http://127.0.0.1:${port}`;
  const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  let outputBuffer = "";
  const child = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  const collectOutput = (chunk) => {
    outputBuffer = `${outputBuffer}${chunk.toString()}`.slice(-4_000);
    if (process.env.PUBLIC_HTML_SERVER_LOGS === "1") {
      process.stdout.write(chunk);
    }
  };
  child.stdout.on("data", collectOutput);
  child.stderr.on("data", collectOutput);

  try {
    await waitForServer(url, child, () => outputBuffer);
  } catch (error) {
    stopServer(child);
    throw error;
  }

  return {
    baseUrl: url,
    cleanup: () => stopServer(child),
  };
}

async function resolveBaseUrl() {
  if (configuredBaseUrl) {
    return {
      baseUrl: configuredBaseUrl.replace(/\/+$/, ""),
      cleanup: () => {},
    };
  }

  if (await targetLooksLikeThisApp(defaultBaseUrl)) {
    return { baseUrl: defaultBaseUrl, cleanup: () => {} };
  }

  for (let port = 3001; port <= 3099; port += 1) {
    const candidate = `http://127.0.0.1:${port}`;
    if (await targetLooksLikeThisApp(candidate)) {
      console.warn(
        `Public HTML check target ${defaultBaseUrl} is not this app; using ${candidate}.`,
      );
      return { baseUrl: candidate, cleanup: () => {} };
    }
  }

  return startBuiltServer();
}

const { baseUrl, cleanup } = await resolveBaseUrl();
const results = [];

try {
  for (const route of routes) {
    results.push(await checkRoute(baseUrl, route));
  }
} finally {
  cleanup();
}

for (const result of results) {
  const status = result.passed ? "PASS" : "FAIL";
  const checks = Object.entries(result.checks)
    .map(([key, value]) => `${key}=${value ? "yes" : "no"}`)
    .join(" ");
  console.log(`${status} ${result.path} ${checks}`);
}

if (results.some((result) => !result.passed)) {
  console.error(`Public HTML check target: ${baseUrl}`);
  process.exitCode = 1;
}
