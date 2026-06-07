import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router-compat";
import toast from "react-hot-toast";

import { passwordLogin } from "../../services/authService";
import { setAuthTokenInCookie } from "../../services/httpService";
import Loading from "../../ui/Loading";

const logo = "/assets/images/app-icons-dark-tile/app-icon-dark-navy-512.png";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin";
const QUICK_LOGIN_ACCOUNTS = [
  {
    role: "مهمان",
    username: "customer",
    password: "customer",
    description: "پنل کاربر، رزروها و علاقه‌مندی‌ها.",
  },
  {
    role: "میزبان",
    username: "houseowner",
    password: "houseowner",
    description: "پنل میزبان، اقامتگاه‌ها و مدیریت رزروها.",
  },
  {
    role: "مدیر",
    username: "admin",
    password: "admin",
    description: "پنل مدیریت و دسترسی کامل مدیریتی.",
  },
];

function AuthContainer() {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: passwordLogin,
    onSuccess: (data) => {
      setAuthTokenInCookie(data.token);
      queryClient.setQueryData(["get-user"], data.user);
      toast.success("با موفقیت وارد شدید.");
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.non_field_errors?.[0] ||
        "ورود ناموفق بود.";
      setError(message);
      toast.error(message);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  const selectQuickLoginAccount = (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setError("");
  };

  return (
    <div className="mx-auto w-full max-w-sm text-right" dir="rtl">
      <div className="rounded-2xl border border-primary-100 bg-gray-100 p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-labelledby="login-title"
          aria-describedby="login-description"
        >
          <div className="mb-2">
            <img
              src={logo}
              alt="جات اینجاست"
              className="mx-auto h-20 w-20 rounded-3xl object-contain shadow-sm"
            />
          </div>

          <div>
            <h1 id="login-title" className="mb-1 text-xl font-bold opacity-90 dark:text-slate-100">
              ورود به جات اینجاست
            </h1>
            <p id="login-description" className="text-xs leading-6 text-gray-500 dark:text-slate-400">
              برای ورود، یکی از نقش‌ها را انتخاب کنید یا اطلاعات حساب را وارد کنید.
            </p>
          </div>

          <div className="grid gap-2" role="group" aria-label="انتخاب حساب ورود سریع">
            {QUICK_LOGIN_ACCOUNTS.map((account) => {
              const isSelected = username === account.username;
              return (
              <button
                key={account.username}
                type="button"
                onClick={() => selectQuickLoginAccount(account)}
                aria-pressed={isSelected}
                aria-label={`انتخاب نقش ${account.role}`}
                className={`rounded-xl border px-3 py-2 text-right transition ${
                  isSelected
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/40"
                    : "border-gray-200 bg-white hover:border-primary-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-primary-400"
                }`}
              >
                <span className="block text-sm font-semibold dark:text-slate-100">
                  {account.role}
                </span>
                <span className="block text-xs leading-5 text-gray-500 dark:text-slate-400">
                  نام کاربری: <bdi dir="ltr">{account.username}</bdi>
                  <span aria-hidden="true"> | </span>
                  رمز: <bdi dir="ltr">{account.password}</bdi>
                </span>
                <span className="block text-xs leading-5 text-gray-400 dark:text-slate-500">
                  {account.description}
                </span>
              </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="username"
              className="text-xs md:text-sm mb-1.5 font-medium dark:text-slate-200"
            >
              نام کاربری
            </label>
            <input
              id="username"
              name="username"
              className="textField__input text-left"
              dir="ltr"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs md:text-sm mb-1.5 font-medium dark:text-slate-200"
            >
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              className="textField__input text-left"
              dir="ltr"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn hover:bg-primary-700 bg-primary-600 w-full"
            type="submit"
            disabled={loginMutation.isLoading}
            aria-busy={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? <Loading /> : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthContainer;
