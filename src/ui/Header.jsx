import { Fragment, useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Link, useNavigate, useLocation } from "@/lib/router-compat";
import { Menu, Transition } from "@headlessui/react";
import {
  UserIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "./Loading.jsx";
import { useUserContext } from "../contexts/UserContext";
import { logOutUser } from "../services/userService.js";
import { clearClientAuthState } from "../services/httpService";
import ThemeToggle from "./ThemeToggle.jsx";
import { reportClientError } from "../utils/reportClientError";

const logo = "/assets/images/core-transparent/jat-injast-logo-horizontal-darkmode-white-text.png";

const navLinks = [
  { path: "/about", label: "درباره ما" },
  { path: "/terms-of-service", label: "قوانین ما" },
];

const mobileNavIcons = {
  "/about": InformationCircleIcon,
  "/terms-of-service": DocumentTextIcon,
};

function Header() {
  const { userData, isUserDataLoading } = useUserContext();
  const navigate  = useNavigate();
  const location  = useLocation();
  const queryClient = useQueryClient();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // hide-on-scroll
  const lastScrollY = useRef(0);
  const timerRef  = useRef(null);
  const headerRef = useRef(null);
  const isDashboard = location.pathname.startsWith("/dashboard");

  const toggleMobileMenu = () => setShowMobileMenu((p) => !p);
  const closeMobileMenu = useCallback(() => setShowMobileMenu(false), []);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setDropdownVisible(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setDropdownVisible(false), 1000);
  };

  const handleUserPanelClick = () => {
    closeMobileMenu();
    location.pathname.includes("/dashboard") ? navigate("/") : navigate("/login");
  };

  const buttonText = location.pathname.includes("/dashboard")
    ? "صفحه اصلی"
    : "پنل کاربری";

  const handleLogout = async () => {
    closeMobileMenu();
    setIsLoggingOut(true);
    try {
      await logOutUser();
      clearClientAuthState();
      queryClient.setQueryData(["get-user"], null);
      queryClient.invalidateQueries(["get-user"]);
      toast.success("از حساب کاربری خود با موفقیت خارج شدید !");
      navigate("/");
    } catch (err) {
      reportClientError("Header logout", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu, location.pathname]);

  useEffect(() => {
    if (!showMobileMenu) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) closeMobileMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [closeMobileMenu, showMobileMenu]);

  useEffect(() => {
    const syncHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          "--header-offset",
          `${headerRef.current.offsetHeight}px`
        );
      }
    };
    syncHeight();
    window.addEventListener("resize", syncHeight);

    const onScroll = () => {
      const y = window.scrollY;
      const hideThreshold = isDashboard ? 48 : 80;

      if (y > lastScrollY.current && y > hideThreshold) setIsHidden(true);
      else if (y < lastScrollY.current || y < 20) setIsHidden(false);
      lastScrollY.current = y;
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", syncHeight);
    };
  }, [isDashboard]);

  useEffect(() => {
    const h = headerRef.current?.offsetHeight || 0;
    document.documentElement.style.setProperty(
      "--header-offset",
      isHidden ? "0px" : `${h}px`
    );
  }, [isHidden]);

  return (
    <div
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-[12000] w-full rounded-b-lg px-4 transition-transform duration-300 small:px-5 sm:px-6 md:px-14 lg:px-20 xl:px-28 2xl:px-36 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav
        dir="rtl"
        aria-label="ناوبری اصلی"
        className="relative mx-auto flex w-full items-center justify-between rounded-b-xl bg-primary-action px-5 py-2 shadow-centered-lg shadow-primary-400 lg:py-2.5"
      >
        <div className="flex items-center">
          <Link
            to="/"
            className="flex flex-shrink-0 items-center"
            aria-label="صفحه اصلی جات اینجاست"
          >
            <Image
              src={logo}
              alt="جات اینجاست"
              width={769}
              height={195}
              priority
              sizes="(min-width: 768px) 13rem, 11rem"
              className="h-8 w-auto max-w-44 object-contain md:h-9 md:max-w-52"
            />
          </Link>

          <ul className="hidden xl:flex gap-8 mr-8">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-white transition duration-300 hover:text-secondary-100"
                  aria-current={location.pathname === path ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <ThemeToggle />

          {/* User menu */}
          {!userData && !isUserDataLoading ? (
            <Link
              to="/login"
              className="text-secondary-50 hover:text-secondary-300"
              aria-current={location.pathname === "/login" ? "page" : undefined}
            >
              ورود | ثبت نام
            </Link>
          ) : isUserDataLoading ? (
            <Loading size={8} type="beat" />
          ) : (
            <div
              className="relative flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={handleUserPanelClick}
                aria-label={buttonText}
                aria-haspopup="menu"
                aria-expanded={isDropdownVisible}
                title={buttonText}
                className="btn-press flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-white/5 text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>
             

              {/* Dropdown */}
              <div
                className={`absolute top-full z-[13000] mt-3 w-52 -left-4 overflow-hidden rounded-2xl border border-primary-100 bg-white py-1 text-gray-800 shadow-lg shadow-primary-100/40 ring-1 ring-black/5 transition-all duration-300 ${
                  isDropdownVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <Menu as="div">
                  <Menu.Items static className="space-y-1 outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <div className="w-full flex flex-col items-center">
                          <button
                            onClick={handleUserPanelClick}
                            className={`${active ? "bg-primary-50 text-primary-800" : "text-gray-700"} w-full px-4 py-2.5 flex items-center gap-2 text-sm transition-colors`}
                          >
                            <UserIcon className="w-4 h-4 text-primary-700" /> {buttonText}
                          </button>
                          <span className="border-b w-11/12 border-primary-50" />
                        </div>
                      )}
                    </Menu.Item>

                    {userData && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className={`${active ? "bg-red-50 text-red-700" : "text-gray-700"} w-full px-4 py-2.5 flex items-center gap-2 text-sm transition-colors disabled:opacity-60`}
                          >
                            <ArrowLeftOnRectangleIcon className="w-4 h-4 text-red-600" />
                            {isLoggingOut ? (
                              <span className="flex items-center">
                                <span className="ml-2">در حال خروج ...</span>
                                <Loading size={20} />
                              </span>
                            ) : (
                              "خروج از حساب کاربری"
                            )}
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          {/* Hamburger */}
          <button
            type="button"
            className="btn-press inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-secondary-50 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            onClick={toggleMobileMenu}
            aria-label={showMobileMenu ? "بستن منوی اصلی" : "باز کردن منوی اصلی"}
            aria-expanded={showMobileMenu}
            aria-controls="mobile-main-menu"
          >
            {showMobileMenu ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>

          {/* Mobile drawer */}
          <Transition
            show={showMobileMenu}
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="-translate-y-2 scale-[0.98] opacity-0"
            enterTo="translate-y-0 scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="translate-y-0 scale-100 opacity-100"
            leaveTo="-translate-y-2 scale-[0.98] opacity-0"
          >
            <div
              id="mobile-main-menu"
              className="absolute left-0 top-full z-[13000] mt-2 w-full origin-top overflow-hidden rounded-[1.75rem] border border-primary-100/80 bg-white p-2 text-right text-gray-800 shadow-2xl shadow-primary-900/15 ring-1 ring-black/5 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 dark:shadow-black/40 dark:ring-white/10"
            >
              {/* nav links */}
              <div className="flex flex-col gap-1">
                {navLinks.map(({ path, label }) => {
                  const Icon = mobileNavIcons[path] || InformationCircleIcon;
                  const isActive = location.pathname === path;

                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={closeMobileMenu}
                      className={`flex min-w-0 items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
                        isActive
                          ? "bg-primary-action text-white shadow-sm shadow-primary-200/60"
                          : "text-gray-700 hover:bg-primary-50 hover:text-primary-800 dark:text-slate-100 dark:hover:bg-white/10 dark:hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="min-w-0 truncate">{label}</span>
                      <span
                        className={`mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-sky-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="my-2 h-px bg-primary-100/80 dark:bg-white/10" />

              <div className="flex items-center justify-between rounded-2xl bg-primary-50/70 px-3 py-2 dark:bg-white/5">
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-100">
                  تم سایت
                </span>
                <ThemeToggle className="border-primary-100 bg-white text-primary-800 shadow-none hover:bg-primary-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" />
              </div>

              <button
                type="button"
                onClick={handleUserPanelClick}
                className="mt-1 flex w-full min-w-0 items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-primary-50 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:text-slate-100 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <span className="min-w-0 truncate">{buttonText}</span>
                <span className="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-sky-100">
                  <UserIcon className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>

              {userData && (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-1 flex w-full min-w-0 items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-200 dark:hover:bg-red-950/30"
                >
                  {isLoggingOut ? (
                    <span className="flex min-w-0 items-center">
                      <span className="ml-2">در حال خروج ...</span>
                      <Loading size={20} />
                    </span>
                  ) : (
                    <span className="min-w-0 truncate">خروج از حساب کاربری</span>
                  )}
                  <span className="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-200">
                    <ArrowLeftOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              )}
            </div>
          </Transition>
        </div>
      </nav>
    </div>
  );
}

export default Header;
