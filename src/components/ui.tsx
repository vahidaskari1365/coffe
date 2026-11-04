import React, { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/router";
import { cn } from "@/utils/cn";
import { useCategoryName, useStore } from "@/lib/store";
import type { Article, Product } from "@/data";

/* ------------------------------ icons ----------------------------- */
const paths: Record<string, React.ReactNode> = {
  arrowLeft: <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  arrowUpLeft: <><path d="M17 17 7 7" /><path d="M7 17V7h10" /></>,
  arrowUp: <><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h10" /></>,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  download: <><path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M4 20h16" /></>,
  phone: <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16.5 12l4 1.5v3A2.5 2.5 0 0 1 18 19 15 15 0 0 1 4 5a2.5 2.5 0 0 1 2.5-2Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  flame: <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s.5 2 2 2c0-4 2-6 2-8Z" />,
  grind: <><circle cx="12" cy="12" r="3.2" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>,
  drop: <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z" />,
  box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5" /><path d="M12 12v9" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  wrench: <path d="M15 4a5 5 0 0 0-5.6 7.8L4 17.2 6.8 20l5.4-5.4A5 5 0 0 0 20 9l-3 1-2-2 1-3a5 5 0 0 0-1-1Z" />,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>,
  chart: <><path d="M4 20V5" /><path d="M4 20h16" /><path d="m8 15 4-5 3 3 4-6" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5a3 3 0 0 1 0 6" /><path d="M18 14c2 .8 3 2.9 3 6" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
  quote: <><path d="M9 7H5v5h4c0 3-1 4-3 5" /><path d="M19 7h-4v5h4c0 3-1 4-3 5" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
  trash: <><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
  edit: <><path d="M4 20h4l11-11-4-4L4 16v4Z" /><path d="m14 5 4 4" /></>,
  logout: <><path d="M14 4h5v16h-5" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h9" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h4" /><path d="M9 13h6M9 17h6" /></>,
  message: <><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9h8M8 12h5" /></>,
  dashboard: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="5" rx="1" /><rect x="13" y="10" width="8" height="11" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3.5 3 14.5 0 18-3-3.5-3-14.5 0-18Z" /></>,
  beaker: <><path d="M9 3h6" /><path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" /><path d="M7 15h10" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  send: <><path d="M21 3 3 10l7 3 3 7 8-17Z" /><path d="M10 13 21 3" /></>,
  play: <path d="M8 5v14l11-7Z" />,
  print: <><path d="M7 8V3h10v5" /><rect x="4" y="8" width="16" height="8" rx="2" /><path d="M7 16h10v5H7z" /></>,
  coffee: <><path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" /><path d="M17 9h2a2.5 2.5 0 0 1 0 5h-2" /><path d="M7 3v2M11 3v2M15 3v2" /></>,
  award: <><circle cx="12" cy="9" r="5" /><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="0.8" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.1M12 17v-4a2 2 0 0 1 4 0v4" /></>,
  whatsapp: <><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 20 12Z" /><path d="M9 9c0 4 2 6 6 6 1 0 1.5-1 1-1.6l-1.5-1-1.2.8c-1-.4-1.8-1.2-2.2-2.2l.8-1.2-1-1.5C10 8 9 8.4 9 9Z" /></>,
  alert: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 9v5M12 17v.1" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.1" /></>,
};

export type IconName = keyof typeof paths;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* ------------------------------ logo ------------------------------ */
export function Logo({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "relative grid shrink-0 place-items-center rounded-[11px]",
          compact ? "h-9 w-9" : "h-11 w-11",
          tone === "dark" ? "bg-espresso" : "bg-paper",
        )}
      >
        <svg viewBox="0 0 44 44" className={compact ? "h-7 w-7" : "h-8 w-8"} aria-hidden="true">
          <path d="M22 4 36 12v20L22 40 8 32V12Z" fill="none" stroke="#c2874c" strokeWidth="1.3" opacity=".85" />
          <path d="M22 11c-5 0-8 4.6-8 11s3 11 8 11 8-4.6 8-11-3-11-8-11Z" fill="none" stroke={tone === "dark" ? "#f8f3ea" : "#171009"} strokeWidth="1.5" />
          <path d="M22 12c-2.6 3-3.4 6.4-3.4 10s.8 7 3.4 10c2.6-3 3.4-6.4 3.4-10s-.8-7-3.4-10Z" fill="none" stroke="#c2874c" strokeWidth="1.3" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-extrabold tracking-tight",
            compact ? "text-[15px]" : "text-[17px]",
            tone === "dark" ? "text-ink" : "text-paper",
          )}
        >
          آرکا صنعت قهوه
        </span>
        <span
          className={cn(
            "eyebrow mt-1 text-[7.5px] tracking-[0.24em]",
            tone === "dark" ? "text-mocha/80" : "text-copper",
          )}
        >
          ARKA COFFEE MACHINERY
        </span>
      </span>
    </div>
  );
}

/* ----------------------------- button ----------------------------- */
type ButtonProps = {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "dark" | "outline" | "light" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconEnd?: IconName;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export function Button({
  children,
  to,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  iconEnd,
  className,
  disabled,
  ariaLabel,
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-[7px] font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = {
    sm: "px-3.5 py-2 text-[12.5px]",
    md: "px-5 py-2.5 text-[13px]",
    lg: "px-6 py-3.5 text-sm",
  } as const;
  const variants = {
    primary: "bg-copper text-white shadow-[0_10px_28px_-12px_rgba(164,105,51,.8)] hover:bg-copper-deep hover:shadow-[0_14px_30px_-10px_rgba(164,105,51,.65)]",
    dark: "bg-espresso text-paper hover:bg-coffee",
    outline: "border border-espresso/20 bg-transparent text-espresso hover:border-copper hover:bg-copper/[0.06]",
    light: "bg-paper text-espresso hover:bg-white",
    ghost: "text-espresso hover:bg-espresso/[0.05]",
  } as const;

  const content = (
    <>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      <span>{children}</span>
      {iconEnd && (
        <Icon
          name={iconEnd}
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
        />
      )}
    </>
  );
  const classes = cn(base, sizes[size], variants[variant], className);

  if (to) return <Link to={to} className={classes} aria-label={ariaLabel}>{content}</Link>;
  if (href) return <a href={href} className={classes} aria-label={ariaLabel} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{content}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );
}

/* ---------------------------- reveal ----------------------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      // @ts-expect-error dynamic tag ref is fine for these elements
      ref={ref}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* -------------------------- section head ------------------------- */
export function SectionHead({
  eyebrow,
  title,
  description,
  action,
  tone = "dark",
  align = "start",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  tone?: "dark" | "light";
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          <span className={cn("h-px w-8", tone === "dark" ? "bg-copper" : "bg-copper/80")} />
          <span className={cn("eyebrow", tone === "dark" ? "text-copper-deep" : "text-amber")}>{eyebrow}</span>
        </div>
        <h2
          className={cn(
            "balance mt-4 text-[clamp(1.55rem,3.1vw,2.55rem)] font-extrabold leading-[1.4] tracking-tight",
            tone === "dark" ? "text-ink" : "text-paper",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-3 text-[13.5px] leading-8 md:text-sm", tone === "dark" ? "text-mocha/90" : "text-paper/65")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* --------------------------- page hero --------------------------- */
export function PageHero({
  eyebrow,
  title,
  description,
  crumb,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  crumb: string;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-espresso text-paper">
      <div className="tech-grid-dark absolute inset-0" />
      <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-copper/15 blur-[110px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-copper/40 to-transparent" />
      <div className="wrap relative pb-12 pt-28 md:pb-16 md:pt-36">
        <nav aria-label="مسیر" className="mb-7 flex items-center gap-2 text-[11px] text-paper/45">
          <Link to="/" className="transition hover:text-copper">خانه</Link>
          <span className="text-copper/50">/</span>
          <span className="text-paper/80">{crumb}</span>
        </nav>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-copper" />
              <span className="eyebrow text-amber">{eyebrow}</span>
            </div>
            <h1 className="balance mt-5 text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold leading-[1.35] tracking-tight">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[13.5px] leading-8 text-paper/60 md:text-sm">{description}</p>
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- badge ------------------------------ */
export function Badge({
  children,
  tone = "copper",
  className,
}: {
  children: React.ReactNode;
  tone?: "copper" | "dark" | "outline" | "olive";
  className?: string;
}) {
  const tones = {
    copper: "bg-copper text-white",
    dark: "bg-espresso text-paper",
    outline: "border border-espresso/15 bg-white/60 text-coffee",
    olive: "bg-olive/12 text-olive",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[10.5px] font-semibold leading-none", tones[tone], className)}>
      {children}
    </span>
  );
}

/* --------------------------- product card ------------------------ */
export function ProductCard({ product }: { product: Product }) {
  const category = useCategoryName(product.category);
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-espresso/[0.09] bg-[#fffdf8] transition-all duration-400 hover:-translate-y-1 hover:border-copper/35 hover:shadow-[0_26px_50px_-30px_rgba(51,35,26,.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent opacity-70" />
        <div className="absolute right-3 top-3 flex flex-col items-start gap-1.5">
          <Badge tone="dark" className="backdrop-blur">{category}</Badge>
          {product.badge && <Badge tone="copper">{product.badge}</Badge>}
        </div>
        <span className="absolute bottom-3 left-3 rounded-[5px] bg-espresso/60 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-paper backdrop-blur">
          {product.latin.split("/")[0].trim()}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="text-[15px] font-extrabold leading-7 text-ink transition-colors group-hover:text-copper-deep">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-6 text-mocha/85">{product.tagline}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-espresso/[0.08] pt-3">
          <div>
            <span className="block text-[9.5px] text-mocha/60">ظرفیت</span>
            <span className="mt-0.5 block text-[11.5px] font-semibold text-coffee">{product.capacity}</span>
          </div>
          <div>
            <span className="block text-[9.5px] text-mocha/60">توان</span>
            <span className="mt-0.5 block text-[11.5px] font-semibold text-coffee">{product.power}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11.5px] font-bold text-copper-deep">مشاهده و مشخصات فنی</span>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-espresso/15 text-coffee transition-all duration-300 group-hover:border-copper group-hover:bg-copper group-hover:text-white">
            <Icon name="arrowLeft" className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* --------------------------- article card ----------------------- */
export function ArticleCard({ article, variant = "default" }: { article: Article; variant?: "default" | "wide" }) {
  if (variant === "wide") {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className="group grid overflow-hidden rounded-lg border border-espresso/10 bg-[#fffdf8] transition hover:border-copper/30 sm:grid-cols-[1.05fr_1.2fr]"
      >
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:h-full">
          <img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-mocha/70">
            <Badge tone="outline">{article.category}</Badge>
            <span className="flex items-center gap-1"><Icon name="calendar" className="h-3.5 w-3.5" />{article.date}</span>
            <span>{article.readTime} مطالعه</span>
          </div>
          <h3 className="mt-3 text-lg font-extrabold leading-8 text-ink transition group-hover:text-copper-deep">{article.title}</h3>
          <p className="mt-2 text-[12.5px] leading-7 text-mocha/85">{article.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-copper-deep">
            ادامهٔ مطلب <Icon name="arrowLeft" className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    );
  }
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-espresso/10 bg-[#fffdf8] transition-all duration-300 hover:-translate-y-1 hover:border-copper/30 hover:shadow-[0_24px_44px_-32px_rgba(51,35,26,.5)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={article.image} alt={article.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute right-3 top-3"><Badge tone="dark">{article.category}</Badge></div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-[10.5px] text-mocha/65">
          <span>{article.date}</span>
          <span className="h-1 w-1 rounded-full bg-copper/60" />
          <span>{article.readTime}</span>
        </div>
        <h3 className="mt-2.5 text-[15px] font-extrabold leading-7 text-ink transition group-hover:text-copper-deep">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-mocha/80">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-[10.5px] text-mocha/60">{article.author}</span>
          <Icon name="arrowUpLeft" className="h-4 w-4 text-copper transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

/* --------------------------- accordion -------------------------- */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-espresso/10 border-y border-espresso/10">
      {items.map((item, i) => {
        const active = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(active ? null : i)}
              aria-expanded={active}
              className="flex w-full items-center justify-between gap-4 py-5 text-right transition hover:text-copper-deep"
            >
              <span className="flex items-start gap-3">
                <span className="num mt-1 text-[10px] text-copper">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[13.5px] font-bold leading-7 md:text-sm">{item.q}</span>
              </span>
              <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border transition", active ? "rotate-180 border-copper bg-copper text-white" : "border-espresso/15 text-coffee")}>
                <Icon name="chevronDown" className="h-3.5 w-3.5" />
              </span>
            </button>
            <div className={cn("grid transition-all duration-300", active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <p className="pb-5 pr-8 text-[12.5px] leading-8 text-mocha/85">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- modal ---------------------------- */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="بستن" onClick={onClose} className="absolute inset-0 bg-espresso/70 backdrop-blur-sm" />
      <div className={cn("relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-paper shadow-2xl sm:rounded-xl", wide ? "max-w-3xl" : "max-w-lg")}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-espresso/10 bg-paper/95 px-5 py-4 backdrop-blur">
          <div>
            <h3 className="text-base font-extrabold text-ink">{title}</h3>
            {subtitle && <p className="mt-1 text-[11.5px] text-mocha/75">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="بستن" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-espresso/15 text-coffee transition hover:border-copper hover:bg-copper hover:text-white">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}

/* --------------------- download catalog button ------------------ */
export function CatalogButton({ product, variant = "outline", label, size = "md" }: { product?: Product; variant?: ButtonProps["variant"]; label?: string; size?: ButtonProps["size"] }) {
  const { downloadCatalog } = useStore();
  return (
    <Button variant={variant} size={size} icon="download" onClick={() => downloadCatalog(product)} className="whitespace-nowrap">
      {label ?? (product ? "دانلود برگهٔ فنی" : "دانلود کاتالوگ")}
    </Button>
  );
}
