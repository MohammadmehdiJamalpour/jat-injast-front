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
  title: {
    default: "Jat Injast",
    template: "%s | Jat Injast",
  },
  description: "Jat Injast house rental and reservation platform.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="ltr" suppressHydrationWarning>
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
