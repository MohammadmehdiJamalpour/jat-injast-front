import AuthContainer from "@/features/authentication/AuthContainer";

function AuthClient() {
  return (
    <section
      dir="rtl"
      aria-labelledby="login-title"
      className="flex min-h-[100dvh] w-full items-center justify-center px-4 pb-10 pt-28 md:container md:min-h-[calc(100dvh-var(--header-offset,4.5rem))] md:pt-24 xl:max-w-8xl"
    >
      <AuthContainer />
    </section>
  );
}

export default AuthClient;
