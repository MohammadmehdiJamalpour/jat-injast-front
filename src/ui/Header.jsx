// ============================
// src/ui/Header.jsx  (UPDATED)
// ============================
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "@/lib/router-compat";
import { Menu } from "@headlessui/react";
import {
  UserIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "./Loading.jsx";
import { useUserContext } from "../contexts/UserContext";
import { logOutUser } from "../services/userService.js";
import CitySearchInput from "./CitySearchInput.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { reportClientError } from "../utils/reportClientError";

const logo = "/assets/jat-injast-wordmark-white.svg";

/* ───── navigation links (desktop) ───── */
const navLinks = [
  { path: "/about", label: "درباره ما" },
  { path: "/terms-of-service", label: "قوانین ما" },
];

function Header() {
  /* ───────── context & router ───────── */
  const { userData, isUserDataLoading } = useUserContext();
  const navigate  = useNavigate();
  const location  = useLocation();
  const queryClient = useQueryClient();

  /* ───────── state ───────── */
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // hide-on-scroll
  const lastScrollY = useRef(0);
  const timerRef  = useRef(null);
  const headerRef = useRef(null);
  const isDashboard = location.pathname.startsWith("/dashboard");

  /* ───────── helpers ───────── */
  const toggleMobileMenu = () => setShowMobileMenu((p) => !p);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setDropdownVisible(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setDropdownVisible(false), 1000);
  };

  const handleUserPanelClick = () =>
    location.pathname.includes("/dashboard") ? navigate("/") : navigate("/login");

  const buttonText = location.pathname.includes("/dashboard")
    ? "صفحه اصلی"
    : "پنل کاربری";

  /* ───────── logout ───────── */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logOutUser();
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

  /* ───────── hide-on-scroll ───────── */
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

  /* ───────── search handler ───────── */
  const handleCitySearch = (city) =>
    navigate(`/search?city=${encodeURIComponent(city)}`);

  /* ───────── derived data ───────── */
  const avatarUrl  = userData?.avatar || "";
  const userStatus = userData?.status || "فعال"; // fallback

  /* ───────── render ───────── */
  return (
    <div
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-[12000] w-full rounded-b-lg px-8 transition-transform duration-300 small:px-10 sm:px-12 md:px-14 lg:px-20 xl:px-28 2xl:px-36 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav
        dir="rtl"
        className="relative mx-auto flex w-full items-center justify-between rounded-b-xl bg-primary-action px-5 py-2 shadow-centered-lg shadow-primary-400 lg:py-2.5"
      >
        {/* ───── left: logo + nav ───── */}
        <div className="flex items-center">
          <Link to="/" className="flex flex-shrink-0 items-center" aria-label="Jat Injast">
            <img
              src={logo}
              alt="Jat Injast"
              className="h-8 w-auto max-w-40 md:h-9 md:max-w-48"
            />
          </Link>

          <ul className="hidden xl:flex gap-8 mr-8">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-white transition duration-300 hover:text-secondary-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ───── right (desktop) ───── */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <ThemeToggle />

          {/* User menu */}
          {!userData && !isUserDataLoading ? (
            <Link to="/login" className="text-secondary-50 hover:text-secondary-300">
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

        {/* ───── mobile bar (≤ md) ───── */}
        <div className="md:hidden flex items-center">
          {/* Hamburger */}
          <button className="px-2 py-1" onClick={toggleMobileMenu}>
            <Bars3Icon className="h-6 w-6 text-secondary-200" />
          </button>

          {/* Mobile drawer */}
          {showMobileMenu && (
            <div className="absolute top-full left-0 z-[13000] w-full rounded-b-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              {/* nav links */}
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full block px-4 py-2 hover:bg-gray-100"
                >
                  {label}
                </Link>
              ))}

              <div className="px-4 py-3">
                <ThemeToggle className="border-primary-100 bg-primary-50 text-primary-800 hover:bg-primary-100" />
              </div>

              <button
                onClick={handleUserPanelClick}
                className="w-full px-4 py-2 flex items-center hover:bg-gray-100"
              >
                <UserIcon className="w-5 h-5" /> {buttonText}
              </button>

              {userData && (
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 pb-4 flex items-center hover:bg-gray-100"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
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
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
