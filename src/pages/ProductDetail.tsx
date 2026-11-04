import { useEffect, useState } from "react";
import { Link, useRouter } from "@/lib/router";
import { useStore } from "@/lib/store";
import { CATEGORIES, COMPANY } from "@/data";
import { Badge, Button, Icon, Modal, ProductCard, Reveal, SectionHead } from "@/components/ui";
import { InquiryForm } from "@/components/InquiryForm";
import { cn } from "@/utils/cn";

export default function ProductDetailPage() {
  const { pathname } = useRouter();
  const slug = pathname.split("/")[2] ?? "";
  const { products, downloadCatalog } = useStore();
  const product = products.find((p) => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setQuoteOpen(false);
    setZoom(false);
  }, [slug]);

  if (!product) {
    return (
      <div className="wrap flex flex-col items-center py-32 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-copper/10 text-copper">
          <Icon name="alert" className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-extrabold text-ink">این دستگاه یافت نشد</h1>
        <p className="mt-2 max-w-sm text-[12.5px] leading-7 text-mocha/80">
          ممکن است محصول حذف یا آدرس آن تغییر کرده باشد. فهرست کامل تجهیزات آرکا را ببینید.
        </p>
        <div className="mt-6 flex gap-2">
          <Button to="/products" iconEnd="arrowLeft">بازگشت به محصولات</Button>
          <Button to="/contact" variant="outline">درخواست مشاوره</Button>
        </div>
      </div>
    );
  }

  const gallery = Array.from(new Set([product.image, ...product.gallery]));
  const category = CATEGORIES.find((c) => c.id === product.category);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const fallbackRelated = products.filter((p) => p.id !== product.id).slice(0, 3);
  const relatedList = related.length ? related : fallbackRelated;
  const quickSpecs = [product.specs[0], product.specs[3] ?? product.specs[2]].filter(Boolean);

  return (
    <>
      <div className="border-b border-espresso/[0.08] bg-paper-2/70">
        <div className="wrap flex flex-wrap items-center gap-2 py-4 text-[11px] text-mocha/60">
          <Link to="/" className="transition hover:text-copper">خانه</Link>
          <span className="text-copper/50">/</span>
          <Link to="/products" className="transition hover:text-copper">محصولات</Link>
          <span className="text-copper/50">/</span>
          <Link to={`/products?cat=${product.category}`} className="transition hover:text-copper">{category?.title}</Link>
          <span className="text-copper/50">/</span>
          <span className="text-coffee">{product.name}</span>
        </div>
      </div>

      <section className="relative overflow-hidden bg-paper py-8 md:py-12">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="wrap relative grid gap-8 lg:grid-cols-[1fr_1.02fr] lg:gap-12">
          <div>
            <div className="group relative overflow-hidden rounded-lg border border-espresso/10 bg-cream">
              <button type="button" onClick={() => setZoom(true)} className="block w-full cursor-zoom-in" aria-label="بزرگ‌نمایی تصویر محصول">
                <img src={gallery[activeImage]} alt={product.name} className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:h-[400px] lg:h-[460px]" />
              </button>
              <div className="absolute right-4 top-4 flex flex-col items-start gap-2">
                <Badge tone="dark">{category?.title}</Badge>
                {product.badge && <Badge tone="copper">{product.badge}</Badge>}
              </div>
              <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded border border-paper/20 bg-espresso/60 px-2.5 py-1.5 text-[9px] text-paper backdrop-blur">
                <Icon name="search" className="h-3 w-3" /> بزرگ‌نمایی
              </span>
              <span className="absolute bottom-4 right-4 rounded bg-paper/85 px-2 py-1 font-mono text-[9px] tracking-widest text-coffee backdrop-blur">{product.latin.split("/")[0].trim()}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`تصویر ${i + 1}`}
                  className={cn("relative overflow-hidden rounded-md border-2 transition", activeImage === i ? "border-copper" : "border-transparent opacity-70 hover:opacity-100")}
                >
                  <img src={img} alt="" className="h-16 w-full object-cover sm:h-20" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-md border border-espresso/10 bg-[#fffdf8] px-3 py-2.5">
              <Icon name="shield" className="h-4 w-4 shrink-0 text-olive" />
              <p className="text-[10px] leading-5 text-mocha/70">تصاویر نمایشی است؛ مشخصات ظاهری بسته به سفارشی‌سازی و رنگ سفارش می‌تواند متفاوت باشد.</p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-[8.5px] text-copper-deep">{product.latin}</span>
              <span className="h-1 w-1 rounded-full bg-copper/50" />
              <span className="flex items-center gap-1 text-[10px] text-olive">
                <span className="h-1.5 w-1.5 rounded-full bg-olive" /> موجود / قابل سفارش
              </span>
            </div>
            <h1 className="balance mt-3 text-[clamp(1.5rem,3.1vw,2.4rem)] font-extrabold leading-[1.4] text-ink">{product.name}</h1>
            <p className="mt-2 text-[13px] font-medium leading-7 text-copper-deep">{product.tagline}</p>
            <p className="mt-3 line-clamp-4 text-[12.5px] leading-7 text-mocha/85">{product.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {quickSpecs.map((spec) => (
                <div key={spec.label} className="rounded-md border border-espresso/10 bg-[#fffdf8] px-3.5 py-3">
                  <span className="block text-[9.5px] text-mocha/60">{spec.label}</span>
                  <span className="mt-1 block text-[12.5px] font-bold text-coffee">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-md border border-copper/25 bg-copper/[0.05] p-3.5">
              <div className="flex items-start gap-2.5">
                <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-copper-deep" />
                <p className="text-[10.5px] leading-6 text-coffee/85">
                  <strong className="font-bold">قیمت بر اساس پیکربندی نهایی استعلام می‌شود.</strong>{" "}
                  امکان سفارشی‌سازی ظرفیت، ولتاژ و متریال وجود دارد. برگهٔ مشخصات فنی را دانلود کنید.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Button onClick={() => setQuoteOpen(true)} size="lg" className="flex-1" iconEnd="arrowLeft">
                درخواست استعلام قیمت
              </Button>
              <Button onClick={() => downloadCatalog(product)} variant="outline" size="lg" icon="download">
                برگهٔ فنی
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-espresso/10 pt-4">
              {[
                { icon: "shield" as const, text: "۱۴ ماه گارانتی" },
                { icon: "wrench" as const, text: "نصب و آموزش در محل" },
                { icon: "truck" as const, text: "ارسال سراسر کشور" },
                { icon: "layers" as const, text: "قطعات یدکی موجود" },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-2 text-[10.5px] text-mocha/75">
                  <Icon name={item.icon} className="h-3.5 w-3.5 text-copper" /> {item.text}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-mocha/70">
              <Icon name="phone" className="h-3.5 w-3.5 text-copper" /> مشاورهٔ فوری:
              <a href={`tel:${COMPANY.phoneRaw}`} className="num font-semibold text-coffee">{COMPANY.phone}</a>
              <span className="text-mocha/40">|</span>
              <a href={`mailto:${COMPANY.salesEmail}`} className="font-semibold text-copper-deep" dir="ltr">{COMPANY.salesEmail}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-espresso/[0.08] bg-paper-2 py-14">
        <div className="wrap grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <div className="rounded-lg border border-espresso/10 bg-[#fffdf8] p-5 md:p-7">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-copper" />
                <h2 className="text-lg font-extrabold text-ink">مشخصات فنی</h2>
              </div>
              <div className="mt-5 overflow-hidden rounded-md border border-espresso/10">
                <table className="w-full border-collapse text-right">
                  <caption className="sr-only">جدول مشخصات فنی {product.name}</caption>
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr key={spec.label} className={cn("border-b border-espresso/[0.07] last:border-0", i % 2 === 0 ? "bg-paper-2/60" : "bg-transparent")}>
                        <th scope="row" className="w-2/5 px-4 py-3 text-[11.5px] font-medium text-mocha/75">{spec.label}</th>
                        <td className="px-4 py-3 text-[12px] font-semibold text-ink">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] text-mocha/55">مشخصات فنی ممکن است بر اساس سفارش نهایی تغییر کند.</p>
                <button type="button" onClick={() => downloadCatalog(product)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-copper-deep hover:underline">
                  <Icon name="download" className="h-3.5 w-3.5" /> دریافت فایل مشخصات
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-espresso/10 bg-[#fffdf8] p-5 md:p-7">
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-copper" />
                <h2 className="text-lg font-extrabold text-ink">قابلیت‌ها و ویژگی‌ها</h2>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 rounded-md border border-espresso/[0.08] bg-paper p-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-olive/12 text-olive">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    <span className="text-[11.5px] leading-6 text-coffee/85">{h}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-[12px] font-bold text-ink">مناسب برای</h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.applications.map((a) => (
                  <span key={a} className="rounded border border-copper/25 bg-copper/[0.05] px-2.5 py-1.5 text-[10.5px] text-copper-deep">{a}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-espresso/10 bg-[#fffdf8] p-5">
              <div className="flex items-center gap-2 text-copper-deep">
                <Icon name="download" className="h-4 w-4" />
                <h2 className="text-[13px] font-extrabold text-ink">دریافت کاتالوگ و برگهٔ فنی</h2>
              </div>
              <p className="mt-2 text-[11px] leading-6 text-mocha/75">
                مشخصات کامل این دستگاه را دانلود کنید؛ فایل قابل چاپ است و برای ارائه به تیم فنی مناسب است.
              </p>
              <div className="mt-4 space-y-2">
                <Button onClick={() => downloadCatalog(product)} variant="dark" size="sm" icon="download" className="w-full">دانلود برگهٔ فنی (PDF)</Button>
                <Button onClick={() => downloadCatalog()} variant="outline" size="sm" icon="file" className="w-full">کاتالوگ کامل محصولات</Button>
                <Button onClick={() => downloadCatalog(product, "html")} variant="ghost" size="sm" icon="print" className="w-full">نسخهٔ HTML قابل چاپ</Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-espresso p-5 text-paper">
              <div className="tech-grid-dark absolute inset-0" />
              <div className="relative">
                <span className="eyebrow text-[7.5px] text-copper">TECHNICAL SUPPORT</span>
                <h2 className="mt-2 text-[15px] font-extrabold">مشاورهٔ فنی پیش از خرید</h2>
                <p className="mt-2 text-[11px] leading-6 text-paper/55">
                  ظرفیت، فضای نصب و شرایط برق/گاز خود را بگویید؛ پیکربندی مناسب را پیشنهاد می‌دهیم.
                </p>
                <Button onClick={() => setQuoteOpen(true)} size="sm" className="mt-4 w-full" iconEnd="arrowLeft">ثبت درخواست مشاوره</Button>
                <a href={`tel:${COMPANY.phoneRaw}`} className="mt-3 flex items-center justify-center gap-2 text-[11px] text-paper/60 hover:text-copper">
                  <Icon name="phone" className="h-3.5 w-3.5" /> <span className="num" dir="ltr">{COMPANY.phone}</span>
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-espresso/10 bg-[#fffdf8] p-5">
              <h2 className="text-[12px] font-extrabold text-ink">خدمات پس از فروش</h2>
              <ul className="mt-3 space-y-2.5">
                {["نصب و کالیبراسیون توسط تیم فنی", "آموزش اپراتور و تحویل مستندات", "سرویس دوره‌ای و قرارداد نگهداشت", "تأمین قطعات یدکی اصلی"].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[10.5px] leading-6 text-mocha/80">
                    <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-copper" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <SectionHead
            eyebrow="RELATED EQUIPMENT"
            title="تجهیزات مرتبط"
            description="تکمیل‌کنندهٔ این دستگاه در یک خط تولید یا بار قهوه."
            action={<Button to="/products" variant="outline" iconEnd="arrowLeft">همهٔ تجهیزات</Button>}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedList.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Modal open={quoteOpen} onClose={() => setQuoteOpen(false)} title="درخواست استعلام قیمت" subtitle={product.name} wide>
        <InquiryForm compact initialProduct={product.name} source="صفحهٔ محصول" />
      </Modal>

      <Modal open={zoom} onClose={() => setZoom(false)} title={product.name} subtitle={product.latin} wide>
        <img src={gallery[activeImage]} alt={product.name} className="w-full rounded-md" />
      </Modal>
    </>
  );
}
