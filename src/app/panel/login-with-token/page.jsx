import { LoginWithTokenClient } from "../../_components/ClientRoutes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "ورود با توکن",
};

export default function LoginWithTokenPage() {
  return <LoginWithTokenClient />;
}
