const backendUrl =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://127.0.0.1:8000";
const mediaBackendUrl =
  process.env.MEDIA_BACKEND_URL ||
  backendUrl;

const withProtocol = (value = "") =>
  !value || /^https?:\/\//i.test(value) ? value : `https://${value}`;

const imageRemoteSourceValues = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
  process.env.NEXT_PUBLIC_CDN_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.SITE_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  "https://jatinjast.site",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
];

const toImageRemotePattern = (value) => {
  if (!value || value.startsWith("/")) return null;

  try {
    const url = new URL(withProtocol(value));
    const protocol = url.protocol.replace(":", "");

    if (protocol !== "http" && protocol !== "https") return null;

    const pathname =
      url.pathname && url.pathname !== "/"
        ? `${url.pathname.replace(/\/+$/, "")}/**`
        : "/**";

    return {
      protocol,
      hostname: url.hostname,
      port: url.port,
      pathname,
    };
  } catch {
    return null;
  }
};

const imageRemotePatterns = Array.from(
  new Map(
    imageRemoteSourceValues
      .map(toImageRemotePattern)
      .filter(Boolean)
      .map((pattern) => [
        `${pattern.protocol}//${pattern.hostname}:${pattern.port}${pattern.pathname}`,
        pattern,
      ]),
  ).values(),
);

const toOrigin = (value) => {
  if (!value || value.startsWith("/")) return null;

  try {
    return new URL(withProtocol(value)).origin;
  } catch {
    return null;
  }
};

const uniqueValues = (values) => Array.from(new Set(values.filter(Boolean)));

const backendOrigin = toOrigin(backendUrl);
const connectSources = uniqueValues([
  "'self'",
  backendOrigin,
  toOrigin(process.env.NEXT_PUBLIC_API_BASE_URL),
  toOrigin(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
  toOrigin(process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT),
  "https://map.ir",
  "https://*.map.ir",
  "https://*.tile.openstreetmap.org",
  process.env.NODE_ENV !== "production" ? "http://127.0.0.1:*" : null,
  process.env.NODE_ENV !== "production" ? "http://localhost:*" : null,
  process.env.NODE_ENV !== "production" ? "ws://127.0.0.1:*" : null,
  process.env.NODE_ENV !== "production" ? "ws://localhost:*" : null,
]);

const imgSources = uniqueValues([
  "'self'",
  "data:",
  "blob:",
  backendOrigin,
  toOrigin(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
  toOrigin(process.env.NEXT_PUBLIC_CDN_URL),
  "https:",
  process.env.NODE_ENV !== "production" ? "http:" : null,
]);

const cspDirectives = [
  ["default-src", ["'self'"]],
  ["base-uri", ["'self'"]],
  ["font-src", ["'self'", "data:"]],
  ["form-action", ["'self'"]],
  ["frame-ancestors", ["'none'"]],
  ["frame-src", ["'none'"]],
  ["img-src", imgSources],
  ["object-src", ["'none'"]],
  [
    "script-src",
    uniqueValues([
      "'self'",
      "'unsafe-inline'",
      process.env.NODE_ENV !== "production" ? "'unsafe-eval'" : null,
    ]),
  ],
  ["style-src", ["'self'", "'unsafe-inline'"]],
  ["connect-src", connectSources],
  process.env.NODE_ENV === "production"
    ? ["upgrade-insecure-requests", []]
    : null,
]
  .filter(Boolean)
  .map(([name, values]) => `${name}${values.length ? ` ${values.join(" ")}` : ""}`)
  .join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspDirectives,
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=(), usb=(), browsing-topics=()",
  },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: imageRemotePatterns,
  },
  async rewrites() {
    return [
      {
        source: "/media/:path*",
        destination: `${mediaBackendUrl}/media/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
