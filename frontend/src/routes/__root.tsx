import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { useApp } from "@/lib/store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center app-stage px-4 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center app-stage px-4 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Physcal — Inclusive sports for everyone" },
      {
        name: "description",
        content:
          "AI-powered inclusive sports platform for beginners, women, and people with accessibility needs.",
      },
      { name: "author", content: "Physcal" },
      { property: "og:title", content: "Physcal — Inclusive sports for everyone" },
      {
        property: "og:description",
        content: "Sports for every body. Adaptive coaching, real community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="app-loading" className="app-loading" role="status" aria-live="polite">
          <div className="app-loading__content">
            <div className="app-loading__logo">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <path d="M16 4 L28 28 L22 28 L16 14 L10 28 L4 28 Z" fill="#1C1C1A" />
                <path d="M11.5 22 L20.5 22" stroke="#1C1C1A" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="app-loading__label">Physcal</div>
            <div className="app-loading__bar">
              <span />
            </div>
          </div>
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const routerState = useRouterState();

  useEffect(() => {
    setTheme(theme);
  }, []); // eslint-disable-line

  useEffect(() => {
    const el = document.getElementById("app-loading");
    if (!el) return;
    el.classList.add("app-loading--hide");
    const timeout = window.setTimeout(() => el.remove(), 900);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
