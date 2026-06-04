import SiteChrome from "./_components/SiteChrome";
import { Link } from "@/lib/router-compat";

export default function NotFoundPage() {
  return (
    <SiteChrome>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-3xl font-bold text-primary-800">Page not found</h1>
        <Link
          to="/"
          className="rounded-3xl bg-primary-600 px-5 py-2 text-white hover:bg-primary-700"
        >
          Back home
        </Link>
      </div>
    </SiteChrome>
  );
}
