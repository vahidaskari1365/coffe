import { useEffect, useState } from "react";
import { Link, useRouter } from "@/lib/router";
import { useStore } from "@/lib/store";
import { COMPANY } from "@/data";
import { Button, Icon, Logo, type IconName } from "./ui";
import { cn } from "@/utils/cn";

const NAV: { label: string; to: string; latin: string }[] = [
  { label: "خانه", to: "/", latin: "HOME" },
  { label: "محصولات", to: "/products", latin: "EQUIPMENT" },
  { label: "فناوری‌ها", to: "/technology", latin: "PROCESS" },
  { label: "پروژه‌ها", to: "/projects", latin: "PROJECTS" },
  { label: "مقالات", to: "/articles", latin: "JOURNAL" },
  { label: "درباره ما", to: "/about", latin: "ABOUT" },
  { label: "تماس", to: "/contact", latin: "CONTACT" },
];

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Header() {
  const { pathname } = useRouter();
  const { downloadCatalog } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-espresso text-paper/75">
        <div className="wrap flex h-9 items-center justify-between gap-4 text-[10.5px]">
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:flex">
              <Icon name="phone" className="h-3 w-3 text-copper" />
              <a href={`tel:${COMPANY.phoneRaw}`} className="num transition hover:text-paper">{COMPANY.phone}</a>
            </span>
            <span className="hidden h-3 w-px bg-paper/15 md:block" />
            <span className="hidden items-center gap-1.5 md:flex">
              <Icon name="mail" className="h-3 w-3 text-copper" />
              <a href={`mailto:${COMPANY.email}`} className="transition hover:text-paper" dir="ltr">{COMPANY.email}</a>
            </span>
            <span className="eyebrow flex items-center gap-2 text-[8px] text-paper/45 sm:hidden">
              <span className="pulse-dot h-1 w-1 rounded-full bg-copper" />
              ARKA COFFEE MACHINERY
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => downloadCatalog()}
              className="hidden items-center gap-1.5 transition hover:text-copper sm:flex"
            >
              <Icon name="download" className="h-3 w-3" /> دریافت کاتالوگ
            </button>
            <span className="hidden h-3 w-px bg-paper/15 sm:block" />
            <Link to="/admin" className="flex items-center gap-1.5 transition hover:text-copper">
              <Icon name="settings" className="h-3 w-3" /> پنل مدیریت
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b border-espresso/[0.08] bg-paper/95 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_10px_30px_-22px_rgba(23,16,9,.55)]",
        )}
      >
        <div className="wrap flex h-[68px] items-center justify-between gap-4">
          <Link to="/" aria-label="آرکا صنعت قهوه — خانه">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="ناوبری اصلی">
            {NAV.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-[12.5px] font-semibold transition-colors",
                    active ? "text-copper-deep" : "text-coffee/75 hover:text-ink",
                  )}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-copper" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button to="/contact" size="sm" iconEnd="arrowLeft" className="hidden md:inline-flex">
              مشاورهٔ فنی
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-md border border-espresso/15 text-ink transition hover:border-copper hover:text-copper-deep lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      <div className={cn("fixed inset-0 z-[90] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={cn("absolute inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={cn(
            "absolute inset-y-0 right-0 flex w-[88%] max-w-[360px] flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="منوی موبایل"
        >
          <div className="flex items-center justify-between border-b border-espresso/10 px-5 py-4">
            <Logo compact />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن منو"
              className="grid h-9 w-9 place-items-center rounded-md border border-espresso/15 text-coffee"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="ناوبری موبایل">
            {NAV.map((item, i) => {
              const active = isActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md border-b border-espresso/[0.07] px-2 py-3.5 transition",
                    active ? "text-copper-deep" : "text-coffee hover:text-ink",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="num text-[9px] text-copper/70">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-bold">{item.label}</span>
                  </span>
                  <span className="eyebrow text-[7.5px] text-mocha/40">{item.latin}</span>
                </Link>
              );
            })}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center gap-3 rounded-md border border-espresso/10 bg-paper-2 px-3 py-3 text-[12.5px] font-semibold text-coffee"
            >
              <Icon name="settings" className="h-4 w-4 text-copper" /> پنل مدیریت محتوا
            </Link>
          </nav>
          <div className="space-y-3 border-t border-espresso/10 p-5">
            <Button to="/contact" className="w-full" iconEnd="arrowLeft" onClick={() => setOpen(false)}>
              درخواست مشاورهٔ فنی
            </Button>
            <button
              type="button"
              onClick={() => {
                downloadCatalog();
                setOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-[7px] border border-espresso/15 py-2.5 text-[12px] font-semibold text-coffee"
            >
              <Icon name="download" className="h-4 w-4" /> دریافت کاتالوگ محصولات
            </button>
            <div className="flex items-center justify-between pt-1 text-[10.5px] text-mocha/70">
              <span className="num">{COMPANY.phone}</span>
              <span className="eyebrow text-[7.5px] text-copper">EST. ۱۳۹۲</span>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}

export function Footer() {
  const { downloadCatalog } = useStore();
  const [email, setEmail] = useState("");
  const { notify } = useStore();
  const year = new Date().toLocaleDateString("fa-IR", { year: "numeric" });

  return (
    <footer className="relative overflow-hidden bg-espresso text-paper">
      <div className="tech-grid-dark absolute inset-0 opacity-60" />
      <div className="absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-copper/10 blur-[120px]" />
      <div className="wrap relative">
        <div className="grid gap-10 border-b border-paper/10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.35fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-[12.5px] leading-7 text-paper/55">
              طراحی، ساخت و تأمین ماشین‌آلات صنعتی قهوه؛ از رستور و آسیاب تا خطوط استخراج و بسته‌بندی. همراه
              شما از انتخاب تجهیزات تا راه‌اندازی کامل.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {([
                { icon: "instagram", href: "https://instagram.com", label: "اینستاگرام" },
                { icon: "linkedin", href: "https://linkedin.com", label: "لینکدین" },
                { icon: "whatsapp", href: "https://wa.me/982155904210", label: "واتس‌اپ" },
                { icon: "send", href: "https://t.me", label: "تلگرام" },
              ] as { icon: IconName; href: string; label: string }[]).map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-md border border-paper/15 text-paper/65 transition hover:border-copper hover:bg-copper hover:text-white"
                >
                  <Icon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 text-[13px] font-bold text-paper">
              <span className="h-px w-5 bg-copper" /> دسترسی سریع
            </h4>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="group inline-flex items-center gap-2 text-[12px] text-paper/55 transition hover:text-copper">
                    <span className="h-px w-0 bg-copper transition-all group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 text-[13px] font-bold text-paper">
              <span className="h-px w-5 bg-copper" /> محصولات
            </h4>
            <ul className="space-y-2.5 text-[12px] text-paper/55">
              <li><Link to="/products?cat=roaster" className="transition hover:text-copper">رستورهای صنعتی</Link></li>
              <li><Link to="/products?cat=grinder" className="transition hover:text-copper">آسیاب و دوزینگ</Link></li>
              <li><Link to="/products?cat=extraction" className="transition hover:text-copper">اسپرسو و استخراج</Link></li>
              <li><Link to="/products?cat=packaging" className="transition hover:text-copper">خطوط بسته‌بندی</Link></li>
              <li>
                <button type="button" onClick={() => downloadCatalog()} className="mt-2 inline-flex items-center gap-1.5 rounded border border-copper/40 px-2.5 py-1.5 text-[11px] text-copper transition hover:bg-copper hover:text-white">
                  <Icon name="download" className="h-3.5 w-3.5" /> کاتالوگ محصولات
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 flex items-center gap-2 text-[13px] font-bold text-paper">
              <span className="h-px w-5 bg-copper" /> تماس با ما
            </h4>
            <ul className="space-y-3 text-[11.5px] text-paper/60">
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                <span className="leading-6">{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-copper" />
                <a href={`tel:${COMPANY.phoneRaw}`} className="num transition hover:text-copper">{COMPANY.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-copper" />
                <a href={`mailto:${COMPANY.email}`} className="transition hover:text-copper" dir="ltr">{COMPANY.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-copper" />
                <span className="leading-6">{COMPANY.hours}</span>
              </li>
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim()) return;
                notify("ایمیل شما ثبت شد؛ خبرنامهٔ فنی آرکا برایتان ارسال می‌شود.");
                setEmail("");
              }}
              className="mt-5"
            >
              <label htmlFor="newsletter" className="mb-1.5 block text-[10.5px] text-paper/45">خبرنامهٔ فنی و تحلیل بازار</label>
              <div className="flex items-center gap-1.5 rounded-[6px] border border-paper/15 bg-paper/[0.06] p-1 focus-within:border-copper">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل شما"
                  dir="ltr"
                  className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[11.5px] text-paper outline-none placeholder:text-right placeholder:text-paper/35"
                />
                <button type="submit" aria-label="عضویت در خبرنامه" className="grid h-7 w-7 shrink-0 place-items-center rounded bg-copper text-white transition hover:bg-amber">
                  <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-5 text-[10.5px] text-paper/40 md:flex-row">
          <p>© {year} آرکا صنعت قهوه — تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-4">
            <span className="eyebrow text-[7.5px] tracking-[0.2em] text-copper/70">ENGINEERED FOR COFFEE PROFESSIONALS</span>
            <span className="hidden h-3 w-px bg-paper/15 md:block" />
            <span>قوانین و حریم خصوصی</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <div className="fixed bottom-20 left-4 z-40 flex flex-col items-center gap-2 md:bottom-5">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="بازگشت به بالا"
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border border-espresso/15 bg-paper/95 text-coffee shadow-lg backdrop-blur transition-all duration-300 hover:border-copper hover:bg-copper hover:text-white",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <Icon name="arrowUp" className="h-4 w-4" />
      </button>
      <a
        href="https://wa.me/982155904210"
        target="_blank"
        rel="noreferrer"
        aria-label="گفتگو در واتس‌اپ"
        className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-paper shadow-lg transition hover:bg-copper"
      >
        <Icon name="whatsapp" className="h-4 w-4" />
      </a>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-espresso/10 bg-paper/95 p-2.5 backdrop-blur md:hidden">
      <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center justify-center gap-2 rounded-[7px] border border-espresso/20 py-2.5 text-[11.5px] font-bold text-coffee">
        <Icon name="phone" className="h-4 w-4 text-copper" /> تماس با آرکا
      </a>
      <Link to="/contact" className="flex items-center justify-center gap-2 rounded-[7px] bg-copper py-2.5 text-[11.5px] font-bold text-white">
        درخواست مشاوره <Icon name="arrowLeft" className="h-4 w-4" />
      </Link>
    </div>
    </>
  );
}
