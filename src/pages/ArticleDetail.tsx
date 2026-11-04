import { useEffect, useState } from "react";
import { Link, useRouter } from "@/lib/router";
import { useStore } from "@/lib/store";
import { ArticleCard, Badge, Button, Icon } from "@/components/ui";
import { COMPANY } from "@/data";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-espresso/20" aria-hidden="true">
      <div className="h-full bg-copper transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default function ArticleDetailPage() {
  const { pathname } = useRouter();
  const slug = pathname.split("/")[2] ?? "";
  const { articles, notify } = useStore();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="wrap flex flex-col items-center py-32 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-copper/10 text-copper"><Icon name="file" className="h-7 w-7" /></span>
        <h1 className="mt-5 text-xl font-extrabold text-ink">مقاله یافت نشد</h1>
        <p className="mt-2 max-w-sm text-[12.5px] leading-7 text-mocha/80">این مطلب ممکن است جابه‌جا یا حذف شده باشد. آرشیو مقالات را ببینید.</p>
        <Button to="/articles" className="mt-6" iconEnd="arrowLeft">بازگشت به مقالات</Button>
      </div>
    );
  }

  const headings = article.content.filter((b): b is { type: "h"; text: string } => b.type === "h");
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("لینک مقاله کپی شد.");
    } catch {
      notify("کپی لینک در این مرورگر ممکن نشد.", "error");
    }
  };

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="relative overflow-hidden bg-espresso pb-14 pt-24 text-paper md:pb-20 md:pt-32">
          <div className="tech-grid-dark absolute inset-0" />
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-copper/15 blur-[100px]" />
          <div className="wrap relative max-w-4xl">
            <nav aria-label="مسیر" className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-paper/45">
              <Link to="/" className="hover:text-copper">خانه</Link>
              <span className="text-copper/50">/</span>
              <Link to="/articles" className="hover:text-copper">مقالات</Link>
              <span className="text-copper/50">/</span>
              <span className="text-paper/75">{article.category}</span>
            </nav>
            <Badge tone="copper">{article.category}</Badge>
            <h1 className="balance mt-5 text-[clamp(1.6rem,3.8vw,2.9rem)] font-extrabold leading-[1.45]">{article.title}</h1>
            <p className="mt-4 max-w-2xl text-[13px] leading-8 text-paper/60">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-paper/10 pt-5 text-[11px] text-paper/55">
              <span className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-copper/15 text-[10px] font-semibold text-copper">{article.author.split(" ").slice(-2).map((w) => w[0]).join("")}</span>
                {article.author}
              </span>
              <span className="flex items-center gap-1.5"><Icon name="calendar" className="h-3.5 w-3.5 text-copper" /> {article.date}</span>
              <span className="flex items-center gap-1.5"><Icon name="clock" className="h-3.5 w-3.5 text-copper" /> {article.readTime} مطالعه</span>
            </div>
          </div>
        </header>

        <div className="wrap -mt-8 max-w-4xl md:-mt-12">
          <div className="overflow-hidden rounded-lg border border-espresso/10 bg-cream shadow-xl">
            <img src={article.image} alt={article.title} className="h-[250px] w-full object-cover md:h-[380px]" />
          </div>
        </div>

        <div className="wrap grid max-w-6xl gap-10 py-12 lg:grid-cols-[1fr_290px] lg:gap-14">
          <div>
            <div className="space-y-5">
              {article.content.map((block, i) => {
                if (block.type === "h") {
                  return (
                    <h2 key={i} id={`heading-${i}`} className="balance scroll-mt-32 pt-3 text-[clamp(1.15rem,2.2vw,1.55rem)] font-extrabold leading-[1.55] text-ink">
                      <span className="ml-2 inline-block h-4 w-1 rounded bg-copper align-middle" />
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote key={i} className="my-6 rounded-lg border-r-[3px] border-copper bg-paper-2 p-5 md:p-6">
                      <Icon name="quote" className="h-6 w-6 text-copper/50" />
                      <p className="mt-2 text-[14px] font-semibold leading-9 text-coffee">{block.text}</p>
                      {block.author && <footer className="mt-2 text-[10px] text-mocha/60">— {block.author}</footer>}
                    </blockquote>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={i} className="space-y-2.5 rounded-lg border border-espresso/[0.08] bg-[#fffdf8] p-4 md:p-5">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-7 text-coffee/85">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="text-[13px] leading-9 text-mocha/90">{block.text}</p>;
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-espresso/10 pt-5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-mocha/65">اشتراک‌گذاری:</span>
                <button type="button" onClick={share} aria-label="کپی لینک" className="grid h-8 w-8 place-items-center rounded-md border border-espresso/12 text-coffee transition hover:border-copper hover:text-copper">
                  <Icon name="file" className="h-3.5 w-3.5" />
                </button>
                <a href="https://wa.me/?text=" target="_blank" rel="noreferrer" aria-label="اشتراک در واتس‌اپ" className="grid h-8 w-8 place-items-center rounded-md border border-espresso/12 text-coffee transition hover:border-copper hover:text-copper">
                  <Icon name="whatsapp" className="h-3.5 w-3.5" />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="اشتراک در لینکدین" className="grid h-8 w-8 place-items-center rounded-md border border-espresso/12 text-coffee transition hover:border-copper hover:text-copper">
                  <Icon name="linkedin" className="h-3.5 w-3.5" />
                </a>
              </div>
              <span className="flex items-center gap-2 rounded-md bg-paper-2 px-3 py-2 text-[10px] text-mocha/70">
                <Icon name="info" className="h-3.5 w-3.5 text-copper" /> این مطلب برگرفته از تجربهٔ فنی پروژه‌های آرکاست.
              </span>
            </div>

            <div className="mt-8 rounded-lg border border-espresso/10 bg-[#fffdf8] p-5">
              <div className="flex items-start gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-espresso text-copper"><Icon name="users" className="h-5 w-5" /></span>
                <div>
                  <span className="text-[11.5px] font-extrabold text-ink">{article.author}</span>
                  <p className="mt-1 text-[10.5px] leading-6 text-mocha/70">
                    تیم مهندسی آرکا در حوزهٔ طراحی، نصب و بهینه‌سازی تجهیزات فرآوری قهوه فعالیت می‌کند. برای بررسی
                    شرایط خاص پروژه، با ما در تماس باشید.
                  </p>
                  <Link to="/contact" className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-copper-deep hover:underline">
                    گفتگو با تیم فنی <Icon name="arrowLeft" className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
            {headings.length > 0 && (
              <div className="rounded-lg border border-espresso/10 bg-paper-2 p-4">
                <h2 className="flex items-center gap-2 text-[11px] font-extrabold text-ink"><Icon name="layers" className="h-3.5 w-3.5 text-copper" /> در این مقاله</h2>
                <ul className="mt-3 space-y-2 border-r border-copper/25 pr-3">
                  {headings.map((h, i) => {
                    const index = article.content.indexOf(h);
                    return (
                      <li key={`${h.text}-${i}`}>
                        <button
                          type="button"
                          onClick={() => document.getElementById(`heading-${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                          className="block text-right text-[10.5px] leading-6 text-mocha/75 transition hover:text-copper-deep"
                        >
                          {h.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="relative overflow-hidden rounded-lg bg-espresso p-5 text-paper">
              <div className="tech-grid-dark absolute inset-0" />
              <div className="relative">
                <span className="eyebrow text-[7.5px] text-copper">TALK TO AN ENGINEER</span>
                <h2 className="mt-2 text-[14px] font-extrabold">پرسش فنی دارید؟</h2>
                <p className="mt-1.5 text-[10.5px] leading-6 text-paper/55">کارشناسان آرکا دربارهٔ تجهیزات، ظرفیت و نگهداشت راهنمایی می‌کنند.</p>
                <Button to="/contact" size="sm" className="mt-3 w-full" iconEnd="arrowLeft">درخواست مشاوره</Button>
                <a href={`tel:${COMPANY.phoneRaw}`} className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-paper/55 hover:text-copper">
                  <Icon name="phone" className="h-3 w-3" /> <span className="num">{COMPANY.phone}</span>
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-espresso/10 bg-[#fffdf8] p-4">
              <h2 className="text-[11px] font-extrabold text-ink">مقالات مرتبط</h2>
              <div className="mt-3 divide-y divide-espresso/10">
                {related.slice(0, 2).map((a) => (
                  <Link key={a.id} to={`/articles/${a.slug}`} className="group flex gap-2.5 py-2.5">
                    <img src={a.image} alt="" className="h-12 w-14 shrink-0 rounded object-cover" loading="lazy" />
                    <span className="text-[10.5px] font-semibold leading-5 text-coffee/85 transition group-hover:text-copper-deep">{a.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>

      <section className="border-t border-espresso/[0.08] bg-paper-2 py-12">
        <div className="wrap">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-copper-deep">KEEP READING</span>
              <h2 className="mt-2 text-xl font-extrabold text-ink">مطالب مرتبط</h2>
            </div>
            <Button to="/articles" variant="outline" size="sm" iconEnd="arrowLeft">آرشیو مقالات</Button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      </section>
    </>
  );
}
