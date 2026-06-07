import { AuthClient } from "../_components/ClientRoutes";
import SiteChrome from "../_components/SiteChrome";
import { routeModes } from "../route-modes";

export const dynamic = "force-static";
export const metadata = {
  title: "ورود",
  description: routeModes.login.reason,
};

export default function LoginPage() {
  return (
    <SiteChrome>
      <AuthClient />
    </SiteChrome>
  );
}
