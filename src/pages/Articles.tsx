import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ArticleCard, Badge, Button, Icon, PageHero, Reveal, SectionHead } from "@/components/ui";
import { cn } from "@/utils/cn";

export default function ArticlesPage() {
  const { articles, notify } = useStore();
  const [category, setCategory] = useState("همه");
  const [email, setEmail] = useState("");
  const categories = useMemo(() => ["همه", ...Array.from(new Set(articles.map((a) => a.category)))], [articles]);
  const [featured, ...rest] = articles;
  const filtered = rest.filter((a) => category === "همه" || a.category === category);
  const showFeatured = featured && (category === "همه" || featured.category === category);

  return (
    <>
      <PageHero
        eyebrow="ARKA JOURNAL / مقالات"
        title="دانش تخصصی صنعت قهوه"
        description="یادداشت‌ها و تحلیل‌های تیم مهندسی آرکا دربارهٔ رست، آسیاب، عصاره‌گیری، بسته‌بندی و نگهداشت تجهیزات؛ برای تصمیم‌های فنی دقیق‌تر."
        crumb="مقالات"
        aside={
          <div className="flex items-center gap-4 rounded-lg border border-paper/15 bg-paper/[0.04] px-5 py-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-copper/15 text-copper"><Icon name="file" className="h-5 w-5" /></span>
            <div>
              <span className="num block text-lg font-semibold text-paper">{articles.length} مقالهٔ تخصصی</span>
              <span className="mt-0.5 block text-[9.5px] text-paper/45">به‌روزرسانی مستمر توسط تیم فنی</span>
            </div>
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="wrap">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-espresso/10 pb-5 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-[11.5px] font-semibold transition",
                    category === c ? "border-espresso bg-espresso text-paper" : "border-espresso/12 text-coffee/70 hover:border-copper/50",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <span className="text-[10.5px] text-mocha/60">
              <span className="num font-semibold text-copper-deep">{filtered.length + (showFeatured ? 1 : 0)}</span> مطلب در این دسته
            </span>
          </div>

          {showFeatured && (
            <Reveal className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="sparkle" className="h-4 w-4 text-copper" />
                <span className="eyebrow text-[8px] text-copper-deep">EDITOR'S PICK / منتخب سردبیر</span>
              </div>
              <ArticleCard article={featured} variant="wide" />
            </Reveal>
          )}

          {filtered.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article, i) => (
                <Reveal key={article.id} delay={(i % 3) * 80}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-espresso/20 bg-paper-2 px-6 py-14 text-center">
              <Icon name="file" className="mx-auto h-7 w-7 text-copper" />
              <p className="mt-3 text-[13px] font-bold text-ink">در این دسته مطلب دیگری نیست</p>
              <button type="button" onClick={() => setCategory("همه")} className="mt-2 text-[11.5px] font-semibold text-copper-deep underline underline-offset-4">نمایش همهٔ مقالات</button>
            </div>
          )}

          <div className="relative mt-12 overflow-hidden rounded-xl border border-espresso/10 bg-espresso p-6 text-paper md:p-9">
            <div className="tech-grid-dark absolute inset-0" />
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-copper/15 blur-3xl" />
            <div className="relative grid items-center gap-7 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <Badge tone="copper">ARKA LETTER</Badge>
                <h2 className="mt-3 text-[clamp(1.3rem,2.5vw,1.9rem)] font-extrabold leading-[1.5]">هر ماه یک یادداشت فنی، بدون تبلیغات</h2>
                <p className="mt-2 max-w-lg text-[12px] leading-7 text-paper/55">
                  خلاصهٔ تحلیل‌های تیم آرکا دربارهٔ رست، تجهیزات و بازار قهوه را در ایمیل خود دریافت کنید.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  notify("عضویت شما در خبرنامهٔ فنی ثبت شد.");
                  setEmail("");
                }}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-label="ایمیل خبرنامه"
                  className="min-w-0 flex-1 rounded-[7px] border border-paper/20 bg-paper/[0.06] px-3.5 py-3 text-left text-[12px] text-paper outline-none placeholder:text-left placeholder:text-paper/35 focus:border-copper"
                />
                <Button type="submit" iconEnd="arrowLeft">عضویت</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-espresso/[0.08] bg-paper-2 py-12">
        <div className="wrap">
          <SectionHead
            eyebrow="NEED A TECHNICAL ANSWER?"
            title="پرسش فنی دارید که پاسخ آن را در مقالات پیدا نکردید؟"
            description="تیم مهندسی آرکا آمادهٔ بررسی شرایط خاص پروژه شماست."
            action={<Button to="/contact" iconEnd="arrowLeft">پرسیدن سوال فنی</Button>}
          />
        </div>
      </section>
    </>
  );
}
