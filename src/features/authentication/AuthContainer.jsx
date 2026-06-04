import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router-compat";
import toast from "react-hot-toast";

import { passwordLogin } from "../../services/authService";
import { setAuthTokenInCookie } from "../../services/httpService";
import Loading from "../../ui/Loading";

const logo = "/assets/jat-injast-badge.svg";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin";
const TEST_ACCOUNTS = [
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
    description: "پنل مدیریت و دسترسی کامل تست.",
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

  const selectTestAccount = (account) => {
    setUsername(account.username);
    setPassword(account.password);
    setError("");
  };

  return (
    <div className="mx-4 md:mx-0 sm:max-w-sm">
      <div className="rounded-2xl border border-primary-100 bg-gray-100 p-8 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-2">
            <img
              src={logo}
              alt="جات اینجاست"
              className="max-w-24 mx-auto rounded-3xl"
            />
          </div>

          <div>
            <p className="opacity-90 text-xl font-bold mb-1 dark:text-slate-100">
              ورود به جات اینجاست
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              برای تست، یک نقش را انتخاب کنید یا اطلاعات ورود را وارد کنید.
            </p>
          </div>

          <div className="grid gap-2">
            {TEST_ACCOUNTS.map((account) => (
              <button
                key={account.username}
                type="button"
                onClick={() => selectTestAccount(account)}
                className={`rounded-xl border px-3 py-2 text-right transition ${
                  username === account.username
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/40"
                    : "border-gray-200 bg-white hover:border-primary-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-primary-400"
                }`}
              >
                <span className="block text-sm font-semibold dark:text-slate-100">
                  {account.role}
                </span>
                <span className="block text-xs text-gray-500 dark:text-slate-400">
                  {account.username} / {account.password}
                </span>
                <span className="block text-xs text-gray-400 dark:text-slate-500">
                  {account.description}
                </span>
              </button>
            ))}
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
              className="textField__input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
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
              className="textField__input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="btn hover:bg-primary-700 bg-primary-600 w-full"
            type="submit"
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? <Loading /> : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthContainer;
