import { CERTIFICATIONS, COMPANY, FAQS, IMG, TECH_STAGES } from "@/data";
import { Accordion, Badge, Button, CatalogButton, Icon, PageHero, Reveal, SectionHead, type IconName } from "@/components/ui";
import { cn } from "@/utils/cn";

const pillars: { icon: IconName; title: string; desc: string }[] = [
  { icon: "flame", title: "کنترل حرارتی دقیق", desc: "مشعل ماژولار و سنسورهای دوجداره با دقت ±۱٫۵ درجه، پایهٔ تکرارپذیری پروفایل رست." },
  { icon: "chart", title: "ثبت و تحلیل داده", desc: "ذخیرهٔ پروفایل، ثبت بچ و گزارش دوره‌ای برای تصمیم‌گیری بر پایهٔ داده، نه حدس." },
  { icon: "shield", title: "بهداشت و ایمنی", desc: "سطح تماس استیل ۳۰۴/۳۱۶، حفاظت حرارتی، شیر اطمینان و مستندات انطباق." },
  { icon: "wrench", title: "طراحی برای سرویس", desc: "دسترسی آسان به قطعات سایشی و ماژولار بودن، زمان توقف تولید را کاهش می‌دهد." },
];

const chain = [
  { icon: "beaker" as IconName, label: "دانهٔ سبز" },
  { icon: "flame" as IconName, label: "رست" },
  { icon: "grind" as IconName, label: "آسیاب" },
  { icon: "drop" as IconName, label: "عصاره‌گیری" },
  { icon: "box" as IconName, label: "بسته‌بندی" },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="PROCESS & TECHNOLOGY / فناوری‌ها"
        title="فناوری، وقتی طعم را قابل تکرار می‌کند"
        description="فرآیند تولید قهوه یک زنجیرهٔ حساس است: هر تغییر کوچک در دما، زمان یا ذرات، در فنجان دیده می‌شود. راهکارهای مهندسی آرکا برای کنترل این زنجیره طراحی شده‌اند."
        crumb="فناوری‌ها"
        aside={
          <div className="grid grid-cols-2 gap-2">
            {CERTIFICATIONS.map((c) => (
              <div key={c.name} className="rounded-md border border-paper/12 bg-paper/[0.04] px-3 py-2.5">
                <span className="block font-mono text-[12px] font-semibold text-copper">{c.name}</span>
                <span className="mt-0.5 block text-[9px] text-paper/45">{c.label}</span>
              </div>
            ))}
          </div>
        }
      />

      <section className="border-b border-espresso/[0.08] bg-paper-2 py-6">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            {chain.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 md:gap-5">
                <span className="flex items-center gap-2 rounded-md border border-espresso/10 bg-[#fffdf8] px-3 py-2">
                  <Icon name={step.icon} className="h-4 w-4 text-copper" />
                  <span className="text-[11.5px] font-semibold text-coffee">{step.label}</span>
                </span>
                {i < chain.length - 1 && (
                  <span className="hidden items-center gap-1 text-copper/40 sm:flex">
                    <span className="h-px w-5 bg-copper/30" />
                    <Icon name="arrowLeft" className="h-3.5 w-3.5 rotate-180" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap">
          <SectionHead
            eyebrow="THE ARKA METHOD / ۰۱"
            title="چهار مرحله از یک استاندارد"
            description="در هر مرحله، تجهیزات و کنترل کیفیت را با هم می‌بینیم؛ چون یک دستگاه خوب در فرآیند اشتباه، نتیجهٔ درست نمی‌دهد."
          />

          <div className="mt-12 space-y-14 md:space-y-20">
            {TECH_STAGES.map((stage, i) => (
              <Reveal key={stage.id} as="article" className="grid items-center gap-7 lg:grid-cols-2 lg:gap-12">
                <div className={cn("relative", i % 2 === 1 && "lg:order-2")}>
                  <div className="absolute -right-2.5 -top-2.5 h-20 w-20 border-r border-t border-copper/40" aria-hidden="true" />
                  <div className="relative overflow-hidden rounded-lg border border-espresso/10">
                    <img src={stage.image} alt={stage.title} loading="lazy" className="h-[260px] w-full object-cover md:h-[350px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
                      <div className="rounded-md border border-paper/20 bg-espresso/55 px-3 py-2 backdrop-blur-md">
                        <span className="num block text-lg font-semibold text-amber">{stage.metric}</span>
                        <span className="mt-0.5 block text-[9px] text-paper/60">{stage.metricLabel}</span>
                      </div>
                      <span className="num text-[34px] font-semibold leading-none text-paper/25">{stage.number}</span>
                    </div>
                  </div>
                </div>

                <div className={cn(i % 2 === 1 && "lg:order-1")}>
                  <div className="flex items-center gap-2.5">
                    <span className="eyebrow text-[8.5px] text-copper-deep">{stage.latin}</span>
                    <span className="h-px w-8 bg-copper/40" />
                    <span className="num text-[10px] text-mocha/45">STAGE {stage.number}</span>
                  </div>
                  <h2 className="balance mt-3 text-[clamp(1.35rem,2.6vw,2rem)] font-extrabold leading-[1.45] text-ink">{stage.title}</h2>
                  <p className="mt-3 text-[12.5px] leading-8 text-mocha/85">{stage.description}</p>
                  <ul className="mt-5 space-y-2.5">
                    {stage.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[11.5px] leading-6 text-coffee/85">
                        <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-copper/12 text-copper-deep">
                          <Icon name="check" className="h-2.5 w-2.5" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button to="/products" variant="outline" size="sm" iconEnd="arrowLeft">تجهیزات مرتبط</Button>
                    <Button to="/contact" variant="ghost" size="sm" icon="message">گفتگو با کارشناس</Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-espresso py-16 text-paper md:py-24">
        <div className="tech-grid-dark absolute inset-0" />
        <div className="wrap relative">
          <SectionHead
            tone="light"
            eyebrow="ENGINEERING PILLARS / ۰۲"
            title="آنچه در همهٔ تجهیزات آرکا مشترک است"
            description="این چهار اصل، مبنای طراحی و انتخاب تمام دستگاه‌های خط تولید هستند."
          />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="group h-full rounded-lg border border-paper/10 bg-paper/[0.035] p-5 transition hover:border-copper/40">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-copper/15 text-copper">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <span className="num text-[9px] text-paper/25">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-[13px] font-bold">{p.title}</h3>
                  <p className="mt-2 text-[11px] leading-6 text-paper/50">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="relative">
            <img src={IMG.control} alt="اتاق کنترل خط تولید قهوه" loading="lazy" className="h-[300px] w-full rounded-lg object-cover md:h-[420px]" />
            <div className="absolute -bottom-4 left-5 right-5 rounded-md border border-espresso/10 bg-paper p-4 shadow-xl md:left-auto md:w-64">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded bg-olive/12 text-olive"><Icon name="chart" className="h-4 w-4" /></span>
                <div>
                  <span className="block text-[11px] font-bold text-ink">پایش کیفیت در خط</span>
                  <span className="text-[9px] text-mocha/60">گزارش روزانهٔ بچ و کاپینگ</span>
                </div>
              </div>
              <div className="mt-3 flex items-end gap-1">
                {[38, 52, 44, 66, 58, 74, 68, 82, 76, 90, 84, 96].map((h, i) => (
                  <span key={i} className="flex-1 rounded-t bg-copper/70" style={{ height: `${h * 0.32}px` }} />
                ))}
              </div>
            </div>
          </Reveal>
          <div>
            <span className="eyebrow text-copper-deep">QUALITY ASSURANCE / ۰۳</span>
            <h2 className="mt-3 text-[clamp(1.4rem,2.8vw,2.2rem)] font-extrabold leading-[1.45] text-ink">
              کنترل کیفیت، پایان پروژه نیست؛ شروع آن است.
            </h2>
            <p className="mt-4 text-[12.5px] leading-8 text-mocha/85">
              در آرکا، تحویل دستگاه با یک گزارش کالیبراسیون و یک جلسهٔ آموزش همراه است. سپس در بازه‌های
              توافق‌شده، عملکرد تجهیزات و کیفیت محصول پایش می‌شود تا استاندارد اولیه حفظ شود.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "گزارش کالیبراسیون و راه‌اندازی",
                "چک‌لیست نگهداشت پیشگیرانه",
                "آموزش اپراتور و مستندات فنی",
                "پشتیبانی از راه دور و اعزام کارشناس",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 rounded-md border border-espresso/10 bg-[#fffdf8] p-3 text-[10.5px] leading-6 text-coffee/85">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-olive" /> {t}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button to="/projects" iconEnd="arrowLeft">مطالعهٔ پروژه‌ها</Button>
              <CatalogButton variant="outline" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-espresso/[0.08] bg-paper-2 py-16 md:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge tone="outline">سوالات متداول</Badge>
            <h2 className="mt-4 text-[clamp(1.4rem,2.6vw,2rem)] font-extrabold leading-[1.45] text-ink">پیش از انتخاب تجهیزات بدانید</h2>
            <p className="mt-3 text-[12px] leading-7 text-mocha/80">
              پاسخ چند پرسش پرتکرار دربارهٔ انتخاب، تحویل و نگهداشت. برای پرسش تخصصی‌تر با تیم فنی در تماس باشید.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-[12px] text-coffee">
              <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center gap-2 font-semibold hover:text-copper-deep">
                <Icon name="phone" className="h-4 w-4 text-copper" /> <span className="num">{COMPANY.phone}</span>
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 hover:text-copper-deep">
                <Icon name="mail" className="h-4 w-4 text-copper" /> <span dir="ltr">{COMPANY.email}</span>
              </a>
            </div>
          </div>
          <Accordion items={FAQS} />
        </div>
      </section>
    </>
  );
}
