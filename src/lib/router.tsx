import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type RouterValue = {
  pathname: string;
  search: string;
  query: URLSearchParams;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
};

const RouterContext = createContext<RouterValue | null>(null);

function readLocation() {
  const raw = window.location.hash.replace(/^#/, "");
  const [rawPath, rawSearch = ""] = raw.split("?");
  let pathname = rawPath || "/";
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
  return { pathname, search: rawSearch };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useState(readLocation);

  useEffect(() => {
    const onChange = () => setLoc(readLocation());
    window.addEventListener("hashchange", onChange);
    if (!window.location.hash) window.history.replaceState(null, "", "#/");
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const next = to.startsWith("/") ? to : `/${to}`;
    if (opts?.replace) {
      window.history.replaceState(null, "", `#${next}`);
      setLoc(readLocation());
    } else if (`#${next}` === window.location.hash) {
      setLoc(readLocation());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = next;
    }
  }, []);

  const value = useMemo<RouterValue>(() => {
    const query = new URLSearchParams(loc.search);
    return { pathname: loc.pathname, search: loc.search, query, navigate };
  }, [loc, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used inside RouterProvider");
  return ctx;
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const isHashAnchor = to.includes("#") && !to.startsWith("/");
  return (
    <a
      href={isHashAnchor ? to : `#${to}`}
      onClick={(e) => {
        onClick?.(e);
        if (isHashAnchor) return;
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
