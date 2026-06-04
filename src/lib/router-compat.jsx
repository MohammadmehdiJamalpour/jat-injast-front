"use client";

import React, { createContext, useContext, useEffect } from "react";
import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

const OutletContext = createContext(null);

const normalizeHref = (to = "/") => {
  if (typeof to === "string") return to;
  if (typeof to === "number") return to;

  const pathname = to.pathname || "/";
  const search = to.search || "";
  const hash = to.hash || "";
  return `${pathname}${search}${hash}`;
};

export function Link({ to, href, replace, children, ...props }) {
  const resolvedHref = normalizeHref(href ?? to);
  return (
    <NextLink href={resolvedHref} replace={replace} {...props}>
      {children}
    </NextLink>
  );
}

export function NavLink({ to, className, children, ...props }) {
  const pathname = usePathname();
  const href = normalizeHref(to);
  const isActive = pathname === href;
  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive, isPending: false })
      : className;

  return (
    <Link to={href} className={resolvedClassName} {...props}>
      {typeof children === "function"
        ? children({ isActive, isPending: false })
        : children}
    </Link>
  );
}

export function useNavigate() {
  const router = useRouter();

  return (to, options = {}) => {
    if (typeof to === "number") {
      if (to < 0) router.back();
      if (to > 0) router.forward();
      return;
    }

    const href = normalizeHref(to);
    if (options.replace) router.replace(href);
    else router.push(href);
  };
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  const search = searchParams?.toString();

  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: "",
    state: null,
    key: pathname,
  };
}

export function useParams() {
  return useNextParams();
}

export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const setSearchParams = (nextInit, options = {}) => {
    const nextParams = new URLSearchParams(nextInit);
    const href = `${pathname}?${nextParams.toString()}`;
    if (options.replace) router.replace(href);
    else router.push(href);
  };

  return [searchParams, setSearchParams];
}

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export function OutletContextProvider({ value, children }) {
  return (
    <OutletContext.Provider value={value}>{children}</OutletContext.Provider>
  );
}

export function useOutletContext() {
  return useContext(OutletContext);
}

export function Outlet() {
  return null;
}

export function BrowserRouter({ children }) {
  return children;
}

export function Routes({ children }) {
  return children;
}

export function Route() {
  return null;
}
