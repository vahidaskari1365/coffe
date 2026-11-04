import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/data";
import { useStore } from "@/lib/store";
import { useRouter } from "@/lib/router";
import { Badge, Button, CatalogButton, Icon, PageHero, ProductCard, Reveal } from "@/components/ui";
import { cn } from "@/utils/cn";

export default function ProductsPage() {
  const { products } = useStore();
  const { query, navigate } = useRouter();
  const catParam = query.get("cat");
  const [category, setCategory] = useState<string>(catParam ?? "all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "alpha">("featured");

  useEffect(() => {
    setCategory(catParam ?? "all");
  }, [catParam]);

  const changeCategory = (id: string) => {
    setCategory(id);
    navigate(id === "all" ? "/products" : `/products?cat=${id}`, { replace: true });
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = products.filter((p) => {
      const inCat = category === "all" || p.category === category;
      const inSearch =
        !term ||
        [p.name, p.latin, p.tagline, p.capacity, p.description].some((v) => v.toLowerCase().includes(term));
      return inCat && inSearch;
    });
    if (sort === "alpha") return [...list].sort((a, b) => a.name.localeCompare(b.name, "fa"));
    return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [products, category, search, sort]);

  const activeCategory = CATEGORIES.find((c) => c.id === category);

  return (
    <>
      <PageHero
        eyebrow="EQUIPMENT CATALOG / محصولات"
        title="تجهیزات صنعتی قهوه، برای هر مقیاس تولید"
        description="از رستور ۵ کیلویی کافه‌های تخصصی تا خطوط ۴۰۰ کیلوگرمی کارخانه؛ همهٔ دستگاه‌ها با مشخصات فنی مستند، امکان سفارشی‌سازی و پشتیبانی فنی آرکا ارائه می‌شوند."
        crumb="محصولات"
        aside={
          <div className="grid w-full max-w-sm grid-cols-3 divide-x divide-x-reverse divide-paper/15 rounded-lg border border-paper/15 bg-paper/[0.04] p-4 text-center backdrop-blur">
            <div>
              <span className="num block text-lg font-semibold text-copper">{products.length}</span>
              <span className="mt-1 block text-[9px] text-paper/45">مدل تجهیزات</span>
            </div>
            <div>
              <span className="num block text-lg font-semibold text-copper">{CATEGORIES.length}</span>
              <span className="mt-1 block text-[9px] text-paper/45">گروه محصول</span>
            </div>
            <div>
              <span className="num block text-lg font-semibold text-copper">۱۴</span>
              <span className="mt-1 block text-[9px] text-paper/45">ماه گارانتی</span>
            </div>
          </div>
        }
      />

      <section className="py-10 md:py-14">
        <div className="wrap">
          <div className="rounded-lg border border-espresso/10 bg-[#fffdf8] p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Icon name="search" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mocha/50" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو در نام، ظرفیت یا کد دستگاه…"
                  aria-label="جستجوی محصولات"
                  className="field pr-9"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} aria-label="پاک کردن جستجو" className="absolute left-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-mocha/60 hover:bg-espresso/5">
                    <Icon name="close" className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-[8px] text-mocha/50">SORT BY</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as "featured" | "alpha")} aria-label="ترتیب نمایش" className="field w-auto min-w-[150px] py-2 text-[12px]">
                  <option value="featured">پیشنهاد آرکا</option>
                  <option value="alpha">ترتیب الفبا</option>
                </select>
              </div>
            </div>

            <div className="hide-scrollbar mt-4 flex items-center gap-2 overflow-x-auto border-t border-espresso/[0.07] pt-4">
              <button
                type="button"
                onClick={() => changeCategory("all")}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-[11.5px] font-semibold transition",
                  category === "all" ? "border-espresso bg-espresso text-paper" : "border-espresso/12 bg-transparent text-coffee/75 hover:border-copper/50",
                )}
              >
                همهٔ تجهیزات
                <span className={cn("num rounded px-1.5 py-0.5 text-[9px]", category === "all" ? "bg-copper/25 text-amber" : "bg-espresso/[0.06] text-mocha/70")}>{products.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => changeCategory(cat.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-[11.5px] font-semibold transition",
                      category === cat.id ? "border-espresso bg-espresso text-paper" : "border-espresso/12 bg-transparent text-coffee/75 hover:border-copper/50",
                    )}
                  >
                    {cat.title}
                    <span className={cn("num rounded px-1.5 py-0.5 text-[9px]", category === cat.id ? "bg-copper/25 text-amber" : "bg-espresso/[0.06] text-mocha/70")}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11.5px] text-mocha/70">
              {activeCategory ? (
                <>نمایش <span className="font-bold text-coffee">{activeCategory.title}</span> — </>
              ) : (
                <>همهٔ تجهیزات — </>
              )}
              <span className="num font-semibold text-copper-deep">{filtered.length}</span> دستگاه
            </p>
            <CatalogButton label="کاتالوگ کامل محصولات" />
          </div>

          {filtered.length ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-espresso/20 bg-paper-2 px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-espresso/5 text-copper">
                <Icon name="search" className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-base font-extrabold text-ink">دستگاهی با این مشخصات پیدا نشد</h2>
              <p className="mt-2 max-w-sm text-[12px] leading-7 text-mocha/75">
                جستجو را تغییر دهید یا همهٔ تجهیزات را ببینید. برای نیاز خاص، امکان سفارشی‌سازی تجهیزات وجود دارد.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button onClick={() => { setSearch(""); changeCategory("all"); }} variant="dark" size="sm">نمایش همهٔ تجهیزات</Button>
                <Button to="/contact" variant="outline" size="sm" icon="message">درخواست سفارشی‌سازی</Button>
              </div>
            </div>
          )}

          <div className="relative mt-12 overflow-hidden rounded-lg bg-espresso p-6 text-paper md:p-8">
            <div className="tech-grid-dark absolute inset-0" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-copper text-white">
                  <Icon name="target" className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[15px] font-extrabold">مطمئن نیستید کدام ظرفیت مناسب شماست؟</h2>
                  <p className="mt-1.5 max-w-xl text-[11.5px] leading-6 text-paper/55">
                    با محاسبهٔ مصرف هفتگی و فضای تولید، پیشنهاد فنی رایگان دریافت کنید. کارشناسان ما چیدمان و
                    برنامهٔ راه‌اندازی را هم ارائه می‌دهند.
                  </p>
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-wrap gap-2 md:w-auto">
                <Button to="/contact" iconEnd="arrowLeft">مشاورهٔ فنی</Button>
                <Button to="/technology" variant="light" iconEnd="arrowLeft">فناوری‌ها</Button>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 rounded-lg border border-espresso/10 bg-paper-2 px-5 py-4">
            {[
              { icon: "shield" as const, text: "۱۴ ماه گارانتی عملکرد" },
              { icon: "truck" as const, text: "ارسال و نصب سراسر کشور" },
              { icon: "wrench" as const, text: "آموزش اپراتور در محل" },
              { icon: "layers" as const, text: "تأمین قطعات یدکی" },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-2 text-[10.5px] text-mocha/70">
                <Icon name={item.icon} className="h-4 w-4 text-copper" /> {item.text}
              </span>
            ))}
            <Badge tone="olive"><Icon name="check" className="h-3 w-3" /> استاندارد گرید غذایی</Badge>
          </div>
        </div>
      </section>
    </>
  );
}
