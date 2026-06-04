import { HeaderClient } from "./ClientRoutes";

export default function SiteChrome({ children }) {
  return (
    <div className="min-h-screen" dir="rtl">
      <HeaderClient />
      <main className="flex min-h-[85vh] flex-col">{children}</main>
    </div>
  );
}
