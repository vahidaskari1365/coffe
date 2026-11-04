import { COMPANY, FAQS } from "@/data";
import { useRouter } from "@/lib/router";
import { useStore } from "@/lib/store";
import { Accordion, Badge, Button, CatalogButton, Icon, PageHero, SectionHead, type IconName } from "@/components/ui";
import { InquiryForm } from "@/components/InquiryForm";

const channels: { icon: IconName; title: string; value: string; href?: string; note: string }[] = [
  { icon: "phone", title: "تلفن فروش و مشاوره", value: COMPANY.phone, href: `tel:${COMPANY.phoneRaw}`, note: COMPANY.hours },
  { icon: "message", title: "موبایل / واتس‌اپ", value: COMPANY.mobile, href: "https://wa.me/982155904210", note: "پاسخ در ساعات کاری" },
  { icon: "mail", title: "ایمیل", value: COMPANY.email, href: `mailto:${COMPANY.email}`, note: "پاسخ حداکثر تا یک روز کاری" },
  { icon: "pin", title: "دفتر مرکزی و کارگاه", value: COMPANY.address, note: "بازدید با هماهنگی قبلی" },
];

export default function ContactPage() {
  const { products } = useStore();
  const { query } = useRouter();
  const productSlug = query.get("product");
  const initialProduct = productSlug ? products.find((p) => p.slug === productSlug)?.name : undefined;

  return (
    <>
      <PageHero
        eyebrow="CONTACT & CONSULTATION / تماس"
        title="یک گفتگوی فنی، شروع درست پروژه"
        description="فرم زیر را پر کنید تا کارشناسان آرکا با بررسی نیاز شما، پیشنهاد فنی شامل مدل دستگاه، ظرفیت و برنامهٔ راه‌اندازی را ارائه دهند. مشاورهٔ اولیه رایگان است."
        crumb="تماس و مشاوره"
        aside={
          <div className="w-full max-w-sm rounded-lg border border-paper/15 bg-paper/[0.04] p-4">
            <span className="eyebrow text-[7.5px] text-copper">DIRECT LINE</span>
            <a href={`tel:${COMPANY.phoneRaw}`} className="num mt-1.5 block text-xl font-semibold text-paper">{COMPANY.phone}</a>
            <div className="mt-2 flex items-center gap-2 border-t border-paper/10 pt-2 text-[9.5px] text-paper/45">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8ec48a]" /> پاسخگویی {COMPANY.hours}
            </div>
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="wrap grid gap-6 lg:grid-cols-[1.45fr_0.9fr] lg:gap-8">
          <div className="rounded-xl border border-espresso/10 bg-[#fffdf8] p-5 md:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-espresso/10 pb-5">
              <div>
                <Badge tone="outline">فرم درخواست خرید و مشاوره</Badge>
                <h2 className="mt-3 text-[clamp(1.25rem,2.4vw,1.7rem)] font-extrabold leading-[1.5] text-ink">نیاز خود را با ما در میان بگذارید</h2>
                <p className="mt-2 text-[11.5px] leading-6 text-mocha/75">همهٔ فیلدهای ستاره‌دار الزامی هستند. پاسخ‌گویی در ساعات کاری انجام می‌شود.</p>
              </div>
              <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-full bg-copper/10 text-copper sm:grid">
                <Icon name="message" className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-5">
              <InquiryForm initialProduct={initialProduct} source="صفحهٔ تماس" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-espresso p-5 text-paper md:p-6">
              <div className="tech-grid-dark absolute inset-0" />
              <div className="relative">
                <span className="eyebrow text-[8px] text-copper">CONTACT CHANNELS</span>
                <h2 className="mt-2 text-lg font-extrabold">راه‌های ارتباط با آرکا</h2>
                <ul className="mt-4 space-y-4">
                  {channels.map((c) => (
                    <li key={c.title} className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-paper/15 bg-paper/[0.05] text-copper">
                        <Icon name={c.icon} className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="block text-[10px] text-paper/45">{c.title}</span>
                        {c.href ? (
                          <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noreferrer" : undefined} className="mt-0.5 block text-[11.5px] font-semibold text-paper transition hover:text-copper" >
                            {c.value}
                          </a>
                        ) : (
                          <span className="mt-0.5 block text-[11px] leading-6 text-paper/80">{c.value}</span>
                        )}
                        <span className="mt-0.5 block text-[9px] text-paper/35">{c.note}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-2 border-t border-paper/10 pt-4">
                  {([
                    { icon: "instagram" as IconName, label: "اینستاگرام", href: "https://instagram.com" },
                    { icon: "linkedin" as IconName, label: "لینکدین", href: "https://linkedin.com" },
                    { icon: "whatsapp" as IconName, label: "واتس‌اپ", href: "https://wa.me/982155904210" },
                  ]).map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-8 w-8 place-items-center rounded border border-paper/15 text-paper/60 transition hover:border-copper hover:text-copper">
                      <Icon name={s.icon} className="h-3.5 w-3.5" />
                    </a>
                  ))}
                  <span className="mr-auto text-[9px] text-paper/30">@arka.coffee</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-espresso/10 bg-paper-2">
              <div className="map-lines relative h-36 bg-[#e3d6c2]">
                <div className="absolute inset-0 bg-gradient-to-t from-paper-2 to-transparent" />
                <span className="absolute right-[28%] top-[42%] grid h-9 w-9 place-items-center rounded-full bg-copper text-white shadow-lg">
                  <Icon name="pin" className="h-4 w-4" />
                </span>
                <span className="absolute bottom-2 left-3 font-mono text-[8px] tracking-[0.16em] text-coffee/50">TEHRAN HQ · 35.59°N / 51.35°E</span>
                <span className="absolute right-3 top-3 rounded bg-paper/85 px-2 py-1 font-mono text-[8px] tracking-[0.14em] text-coffee/60">INDUSTRIAL ZONE 07</span>
              </div>
              <div className="p-4">
                <h2 className="flex items-center gap-2 text-[11.5px] font-extrabold text-ink"><Icon name="pin" className="h-3.5 w-3.5 text-copper" /> آدرس دفتر و کارگاه</h2>
                <p className="mt-1.5 text-[10.5px] leading-6 text-mocha/75">{COMPANY.address}</p>
                <p className="mt-1 text-[10px] text-mocha/55">{COMPANY.hours}</p>
              </div>
            </div>

            <div className="rounded-xl border border-copper/25 bg-copper/[0.06] p-5">
              <div className="flex items-center gap-2 text-copper-deep">
                <Icon name="download" className="h-4 w-4" />
                <h2 className="text-[12px] font-extrabold text-ink">کاتالوگ محصولات</h2>
              </div>
              <p className="mt-1.5 text-[10.5px] leading-6 text-mocha/75">مشخصات فنی کامل همهٔ دستگاه‌ها را دانلود کنید یا نسخهٔ به‌روز را از تیم فروش بخواهید.</p>
              <div className="mt-3">
                <CatalogButton variant="dark" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-espresso/[0.08] bg-paper-2 py-14 md:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHead eyebrow="FAQ / پرسش‌های متداول" title="پاسخ پرسش‌های رایج" />
            <p className="mt-3 text-[12px] leading-7 text-mocha/80">
              اگر پاسخ پرسش خود را پیدا نکردید، فرم بالا را پر کنید یا مستقیماً تماس بگیرید؛ به همهٔ سوالات فنی
              پاسخ می‌دهیم.
            </p>
            <div className="mt-5 rounded-lg border border-espresso/10 bg-[#fffdf8] p-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-olive/12 text-olive"><Icon name="clock" className="h-4 w-4" /></span>
                <div>
                  <span className="block text-[11px] font-bold text-ink">زمان پاسخ‌گویی</span>
                  <span className="text-[9.5px] text-mocha/60">حداکثر یک روز کاری پس از ثبت درخواست</span>
                </div>
              </div>
              <Button to="/technology" variant="ghost" size="sm" className="mt-2 w-full justify-between" iconEnd="arrowLeft">مطالعهٔ فناوری‌های آرکا</Button>
            </div>
          </div>
          <Accordion items={FAQS} />
        </div>
      </section>
    </>
  );
}
