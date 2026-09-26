import { Link } from "@tanstack/react-router";
import { Menu, ShieldHalf, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LevelBadge } from "@/components/common/primitives";
import { currentPlayer } from "@/mock/users";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/missions", label: "Missions" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/achievements", label: "Achievements" },
  { to: "/profile", label: "Profile" },
] as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2 rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
      aria-label="CyberFS home"
    >
      <ShieldHalf className="size-5 text-success" aria-hidden />
      <span className="font-mono text-sm font-semibold tracking-[0.18em] text-foreground">
        CyberFS
      </span>
    </Link>
  );
}

export function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <BrandMark />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              activeProps={{ className: "bg-elevated text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            {currentPlayer.xp.toLocaleString()} XP
          </span>
          <LevelBadge level={currentPlayer.level} className="hidden sm:inline-flex" />
          <Link
            to="/settings"
            className="hidden rounded-md border border-border px-2.5 py-1.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground sm:block"
          >
            Settings
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="border-t border-border bg-surface px-4 py-2 md:hidden">
          {[...navItems, { to: "/settings", label: "Settings" } as const].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function AppShell({
  children,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Topbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {title ? (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              {description ? (
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {actions}
          </div>
        ) : null}
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-6">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            CyberFS — simulated training environment
          </span>
          <Link to="/tutorial" className="text-xs text-muted-foreground hover:text-foreground">
            How to play
          </Link>
        </div>
      </footer>
    </div>
  );
}

export { X };
