import { LoginWithTokenClient } from "../../_components/ClientRoutes";
import { routeModes } from "../../route-modes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "ورود با توکن",
  description: routeModes.login.reason,
};

export default function LoginWithTokenPage() {
  return <LoginWithTokenClient />;
}
