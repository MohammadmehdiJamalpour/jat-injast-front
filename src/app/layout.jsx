import "../index.css";
import localFont from "next/font/local";
import Script from "next/script";
import Providers from "./providers";
import { getSiteUrl } from "./seo";
import WebVitalsReporter from "./_components/WebVitalsReporter";

const iransans = localFont({
  src: [
    {
      path: "../../public/fonts/IRANSansX-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansX-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansX-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANSansX-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-iransans",
  fallback: ["Arial", "sans-serif"],
});

const themeScript = `
(() => {
  try {
    const key = "jat-injast-theme";
    const stored = localStorage.getItem(key);
    const preference = stored === "light" || stored === "dark" ? stored : "system";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = preference === "dark" || (preference === "system" && systemDark) ? "dark" : "light";
    const root = document.documentElement;
    root.dataset.themePreference = preference;
    root.dataset.theme = resolved;
    root.classList.toggle("dark", resolved === "dark");
  } catch (_) {}
})();
`;

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  manifest: "/manifest.webmanifest",
  title: {
    default: "جات اینجاست",
    template: "%s | جات اینجاست",
  },
  description: "پلتفرم رزرو اقامتگاه و مدیریت سفر در ایران.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "جات اینجاست",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      {
        url: "/assets/images/favicons-transparent/favicon-teal-transparent-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/images/favicons-transparent/favicon-teal-transparent-64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        url: "/assets/images/favicons-transparent/favicon-teal-transparent-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/assets/images/favicons-transparent/favicon-teal-transparent-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/assets/images/favicons-transparent/favicon-teal-transparent-32.png",
    apple: "/assets/images/app-icons-dark-tile/app-icon-dark-navy-512.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iransans.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Script
          id="jat-injast-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <WebVitalsReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
