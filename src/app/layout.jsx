import "../index.css";
import Script from "next/script";
import Providers from "./providers";

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
  manifest: "/manifest.webmanifest",
  title: {
    default: "جات اینجاست",
    template: "%s | جات اینجاست",
  },
  description: "پلتفرم رزرو اقامتگاه و مدیریت سفر در ایران.",
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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <Script
          id="jat-injast-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
