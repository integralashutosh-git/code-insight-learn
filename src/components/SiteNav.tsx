import { Link } from "@tanstack/react-router";
import { Moon, Sun, Code2 } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/editor", label: "AI Editor" },
  { to: "/learn", label: "Learn" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
] as const;

export function SiteNav() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
            <Code2 className="size-5" />
          </span>
          <span className="text-base">CodeInsight</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
          className="ml-auto rounded-xl md:ml-2"
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
        <Button asChild size="sm" className="hidden rounded-xl sm:inline-flex">
          <Link to="/editor">Open AI Editor</Link>
        </Button>
      </nav>
      <div className="flex items-center gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="whitespace-nowrap rounded-xl px-3 py-1.5 text-sm text-muted-foreground"
            activeProps={{ className: "bg-accent text-accent-foreground" }}
            activeOptions={{ exact: link.to === "/" }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}