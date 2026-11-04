import { Link } from "@/lib/router";
import { useStore } from "@/lib/store";
import {
  CATEGORIES,
  CERTIFICATIONS,
  CLIENTS,
  IMG,
  PROJECTS,
  STATS,
  TESTIMONIALS,
  TECH_STAGES,
  type Category,
} from "@/data";
import { ArticleCard, Badge, Button, CatalogButton, Icon, ProductCard, Reveal, SectionHead, type IconName } from "@/components/ui";

const categoryIcons: Record<Category["icon"], IconName> = {
  flame: "flame",
  grind: "grind",
  drop: "drop",
  box: "box",
};

function Hero() {
  return (
    <section className="relative overflow-hidden bg-espresso text-paper">
      <div className="tech-grid-dark absolute inset-0" />
      <div className="absolute -right-32 -top-24 h-[520px] w-[520px] rounded-full bg-copper/[0.14] blur-[130px]" />
      <div className="absolute bottom-0 left-1/3 h-[260px] w-[260px] rounded-full bg-olive/20 blur-[100px]" />
      <div className="absolute inset-y-0 left-[46%] hidden w-px bg-paper/[0.06] lg:block" />

      <div className="wrap relative">
        <div className="grid items-center gap-12 pb-12 pt-12 md:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-16 lg:pt-20">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-[4px] border border-copper/35 bg-copper/10 px-2.5 py-1.5">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-copper" />
                <span className="eyebrow text-[8.5px] text-amber">INDUSTRIAL COFFEE EQUIPMENT</span>
              </span>
              <span className="eyebrow text-[8.5px] text-paper/40">EST. ۱۳۹۲ — TEHRAN</span>
            </div>

            <h1 className="balance mt-6 text-[clamp(2rem,4.6vw,3.9rem)] font-extrabold leading-[1.34] tracking-tight">
              تجهیزات صنعتی قهوه،
              <br />
              <span className="text-copper">با دقتی که طعم را</span>
              <br className="hidden sm:block" /> تکرارپذیر می‌کند.
            </h1>

            <p className="mt-6 max-w-lg text-[13.5px] leading-8 text-paper/60 md:text-[14px]">
              طراحی، ساخت و راه‌اندازی ماشین‌آلات فرآوری قهوه؛ از رستورهای صنعتی و آسیاب‌های دقیق تا خطوط
              استخراج و بسته‌بندی. مهندسی آرکا، در هر فنجان تکرار می‌شود.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/products" size="lg" iconEnd="arrowLeft">
                مشاهدهٔ تجهیزات
              </Button>
              <CatalogButton variant="light" size="lg" label="دریافت کاتالوگ محصولات" />
              <Link
                to="/contact"
                className="group mr-1 inline-flex items-center gap-2 py-3 text-[12.5px] font-semibold text-paper/70 transition hover:text-copper"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full border border-paper/20 transition group-hover:border-copper group-hover:bg-copper/10">
                  <Icon name="phone" className="h-3.5 w-3.5" />
                </span>
                مشاورهٔ فنی تلفنی
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-paper/10 pt-5">
              {["گارانتی ۱۴ ماهه", "نصب و آموزش در محل", "پشتیبانی قطعات یدکی"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-[11px] text-paper/50">
                  <Icon name="check" className="h-3.5 w-3.5 text-copper" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
            <div className="absolute -right-3 -top-3 h-28 w-28 border-r border-t border-copper/50" aria-hidden="true" />
            <div className="absolute -bottom-3 -left-3 h-28 w-28 border-b border-l border-copper/30" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-md border border-paper/10">
              <img
                src={IMG.hero}
                alt="خط تولید و رستوری صنعتی مجهز به تجهیزات آرکا"
                className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[430px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/15 to-transparent" />
              <div className="absolute right-4 top-4 rounded border border-paper/20 bg-espresso/60 px-2.5 py-1.5 backdrop-blur">
                <span className="eyebrow text-[7.5px] text-amber">R-60 / 60 KG BATCH</span>
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <div className="rounded-md border border-paper/15 bg-paper/[0.07] p-3 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-[10px] text-paper/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8ec48a]" /> خط عملیاتی فعال
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="num text-lg font-semibold text-paper">۲۴۰</span>
                    <span className="text-[10px] text-paper/50">کیلوگرم در روز</span>
                  </div>
                </div>
                <div className="rounded-md border border-paper/15 bg-espresso/70 px-3 py-2 text-left backdrop-blur">
                  <span className="eyebrow block text-[7px] text-copper">TEMP CONTROL</span>
                  <span className="num mt-0.5 block text-sm text-paper">۲۰۲٫۴°C</span>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 bottom-24 hidden rounded-md border border-copper/30 bg-copper px-3 py-2 shadow-xl sm:block">
              <span className="block text-[9px] text-white/75">efficiency</span>
              <span className="num block text-sm font-semibold text-white">94.2%</span>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 border-t border-paper/10 py-6 sm:grid-cols-4 md:py-7">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3 border-paper/10 px-2 py-3 sm:border-l sm:first:border-l-0 md:px-5">
              <span className="num text-[22px] font-semibold leading-none text-copper md:text-[27px]">{s.value}</span>
              <span className="text-[9px] text-paper/35">{s.suffix}</span>
              <span className="text-[10.5px] leading-5 text-paper/55 md:text-[11.5px]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientStrip() {
  const list = [...CLIENTS, ...CLIENTS];
  return (
    <section className="border-b border-espresso/[0.07] bg-paper-2 py-5">
      <div className="wrap flex flex-col items-center gap-4 sm:flex-row">
        <span className="shrink-0 text-[10.5px] font-semibold text-mocha/70">
          انتخاب بیش از ۴۰۰ کسب‌وکار قهوه
        </span>
        <span className="hidden h-4 w-px bg-espresso/10 sm:block" />
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee-track flex w-max items-center gap-10">
            {list.map((c, i) => (
              <span key={`${c}-${i}`} className="flex items-center gap-3 whitespace-nowrap text-[12px] font-bold text-coffee/55">
                <Icon name="coffee" className="h-3.5 w-3.5 text-copper/50" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const { products } = useStore();
  return (
    <section className="relative py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          eyebrow="EQUIPMENT CATEGORIES / ۰۱"
          title="از دانهٔ سبز تا بستهٔ آماده"
          description="چهار گروه تجهیزات، یک زنجیرهٔ کامل تولید. هر دستگاه با مشخصات فنی مستند و امکان سفارشی‌سازی برای ظرفیت شما انتخاب می‌شود."
          action={
            <Button to="/products" variant="outline" iconEnd="arrowLeft">
              مشاهدهٔ همهٔ محصولات
            </Button>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <Reveal key={cat.id} delay={i * 80}>
                <Link
                  to={`/products?cat=${cat.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-espresso/10 bg-[#fffdf8] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-copper/35 hover:shadow-[0_24px_44px_-32px_rgba(51,35,26,.5)] md:p-6"
                >
                  <span className="absolute inset-x-0 top-0 h-[2px] w-0 bg-copper transition-all duration-500 group-hover:w-full" />
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-espresso text-copper transition group-hover:bg-copper group-hover:text-white">
                      <Icon name={categoryIcons[cat.icon]} className="h-5 w-5" />
                    </span>
                    <span className="num text-[10px] text-mocha/35">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-[15px] font-extrabold leading-7 text-ink transition group-hover:text-copper-deep">{cat.title}</h3>
                  <p className="mt-1 text-[9px] tracking-[0.16em] text-copper/80" style={{ fontFamily: "var(--font-mono)" }}>{cat.latin}</p>
                  <p className="mt-3 flex-1 text-[11.5px] leading-6 text-mocha/75">{cat.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-espresso/[0.07] pt-3">
                    <span className="text-[10.5px] font-semibold text-coffee/70">{count} مدل تجهیزات</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-espresso/10 text-copper transition group-hover:border-copper group-hover:bg-copper group-hover:text-white">
                      <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const { products } = useStore();
  const featured = products.filter((p) => p.featured);
  const list = (featured.length >= 3 ? featured : products).slice(0, 3);

  return (
    <section className="tech-grid relative border-y border-espresso/[0.07] bg-paper-2 py-16 md:py-24">
      <div className="wrap relative">
        <SectionHead
          eyebrow="SELECTED MACHINES / ۰۲"
          title="دستگاه‌هایی که خط تولید را می‌سازند"
          description="منتخبی از پرفروش‌ترین تجهیزات آرکا؛ هر یک با برگهٔ مشخصات فنی کامل، گارانتی و برنامهٔ نگهداشت."
          action={
            <div className="flex flex-wrap gap-2">
              <CatalogButton variant="dark" />
              <Button to="/products" variant="outline" iconEnd="arrowLeft">کاتالوگ کامل</Button>
            </div>
          }
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-5 overflow-hidden rounded-lg border border-espresso/10 bg-espresso text-paper">
          <div className="relative flex flex-col items-start justify-between gap-5 p-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4 p-2">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-copper text-white">
                <Icon name="file" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[13px] font-bold">کاتالوگ فنی ۱۴۰۴ آرکا</p>
                <p className="mt-1 text-[10.5px] text-paper/50">مشخصات کامل تمام دستگاه‌ها، ظرفیت‌ها و شرایط نصب — بدون نیاز به ثبت‌نام</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 p-1">
              <span className="hidden text-[9px] text-paper/35 sm:block">فرمت HTML · قابل چاپ</span>
              <CatalogButton variant="primary" label="دانلود فوری" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Capabilities() {
  const items: { icon: IconName; title: string; desc: string }[] = [
    { icon: "beaker", title: "طراحی بر پایهٔ آزمایش", desc: "هر پیشنهاد فنی با نمونهٔ دانه، محاسبهٔ ظرفیت و تست کاپینگ آغاز می‌شود." },
    { icon: "wrench", title: "نصب و راه‌اندازی کامل", desc: "تیم فنی آرکا تا تحویل اولین بچ استاندارد، در کنار اپراتور شماست." },
    { icon: "shield", title: "شریک بلندمدت نگهداشت", desc: "قرارداد سرویس دوره‌ای، تأمین قطعات و پشتیبانی از راه دور." },
    { icon: "globe", title: "تأمین بین‌المللی", desc: "دسترسی به شبکهٔ سازندگان معتبر و امکان سفارشی‌سازی تجهیزات." },
  ];
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-lg border border-espresso/10">
            <img src={IMG.roasterMan} alt="اپراتور آرکا در حال کنترل فرآیند رست قهوه" className="h-[320px] w-full object-cover md:h-[440px]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 flex items-end justify-between gap-3 p-4">
              <div>
                <span className="eyebrow text-[7.5px] text-amber">ON-SITE COMMISSIONING</span>
                <p className="mt-1 text-[12px] font-semibold text-paper">تحویل کلید در دست، با آموزش تیم شما</p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-paper/30 text-paper">
                <Icon name="play" className="h-4 w-4" />
              </span>
            </div>
          </div>
          <div className="absolute -left-3 -top-4 hidden rounded-md border border-espresso/10 bg-paper p-4 shadow-xl sm:block">
            <span className="num block text-2xl font-semibold text-copper-deep">۹۸٪</span>
            <span className="mt-1 block text-[9.5px] text-mocha/70">رضایت مشتریان صنعتی</span>
          </div>
          <div className="absolute -bottom-4 right-6 flex items-center gap-2.5 rounded-md bg-copper px-3.5 py-2.5 text-white shadow-xl">
            <Icon name="award" className="h-4 w-4" />
            <span className="text-[10.5px] font-semibold">۱۴ ماه گارانتی عملکرد</span>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-copper" />
            <span className="eyebrow text-copper-deep">WHY ARKA / ۰۳</span>
          </div>
          <h2 className="balance mt-4 text-[clamp(1.55rem,3.1vw,2.5rem)] font-extrabold leading-[1.42] text-ink">
            یک شریک فنی،
            <br className="hidden sm:block" /> نه فقط یک فروشنده.
          </h2>
          <p className="mt-4 max-w-xl text-[13px] leading-8 text-mocha/85">
            تجهیزات درست، نیمی از مسیر است؛ نیم دیگر، انتخاب ظرفیت مناسب، چیدمان دقیق و نگهداشت درست است.
            تیم مهندسی آرکا از اولین جلسه تا سال‌ها پس از نصب همراه شماست.
          </p>
          <div className="mt-7 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="flex gap-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-copper/25 bg-copper/[0.07] text-copper-deep">
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-[12.5px] font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-[11px] leading-6 text-mocha/75">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/about" iconEnd="arrowLeft">دربارهٔ آرکا</Button>
            <Link to="/projects" className="text-[11.5px] font-semibold text-copper-deep underline-offset-4 hover:underline">
              مطالعهٔ نمونه‌کارها
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="relative overflow-hidden bg-espresso py-16 text-paper md:py-24">
      <div className="tech-grid-dark absolute inset-0" />
      <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-copper/10 blur-[100px]" />
      <div className="wrap relative">
        <SectionHead
          tone="light"
          eyebrow="PROCESS & TECHNOLOGY / ۰۴"
          title="چهار مرحله، یک استاندارد طعم"
          description="تجهیزات ما در امتداد یک فرآیند مهندسی‌شده کار می‌کنند. این چرخه، مبنای پیشنهاد فنی ما برای هر پروژه است."
          action={<Button to="/technology" variant="light" iconEnd="arrowLeft">فناوری‌های آرکا</Button>}
        />
        <div className="relative mt-11">
          <div className="absolute right-0 left-0 top-[22px] hidden h-px bg-gradient-to-l from-copper/50 via-paper/15 to-transparent lg:block" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_STAGES.map((stage, i) => (
              <Reveal key={stage.id} delay={i * 90}>
                <Link
                  to="/technology"
                  className="group relative flex h-full flex-col rounded-lg border border-paper/10 bg-paper/[0.035] p-5 transition duration-300 hover:border-copper/40 hover:bg-paper/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <span className="num flex h-11 w-11 items-center justify-center rounded-full border border-copper/40 bg-espresso text-[12px] font-semibold text-amber transition group-hover:bg-copper group-hover:text-white">
                      {stage.number}
                    </span>
                    <Icon name="arrowUpLeft" className="h-4 w-4 text-paper/25 transition group-hover:text-copper" />
                  </div>
                  <p className="eyebrow mt-5 text-[7.5px] text-copper">{stage.latin}</p>
                  <h3 className="mt-2 text-[14px] font-extrabold leading-7 text-paper">{stage.title}</h3>
                  <p className="mt-2 flex-1 text-[11px] leading-6 text-paper/50">{stage.description}</p>
                  <div className="mt-4 flex items-baseline gap-2 border-t border-paper/10 pt-3">
                    <span className="num text-[15px] text-amber">{stage.metric}</span>
                    <span className="text-[9px] text-paper/40">{stage.metricLabel}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-paper/10 pt-6">
          {CERTIFICATIONS.map((cert) => (
            <span key={cert.name} className="flex items-center gap-2 text-[10px] text-paper/40">
              <Icon name="shield" className="h-3.5 w-3.5 text-copper/70" />
              <span className="font-mono font-semibold tracking-wider text-paper/65">{cert.name}</span>
              <span>{cert.label}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  const project = PROJECTS[0];
  return (
    <section className="py-16 md:py-24">
      <div className="wrap">
        <div className="grid overflow-hidden rounded-xl border border-espresso/10 bg-[#fffdf8] lg:grid-cols-2">
          <div className="relative min-h-[280px] overflow-hidden">
            <img src={project.image} alt={project.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent" />
            <div className="absolute right-5 top-5"><Badge tone="copper">CASE STUDY ۰۱</Badge></div>
            <div className="absolute inset-x-5 bottom-5">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded border border-paper/25 bg-espresso/30 px-2 py-1 text-[9.5px] text-paper/85 backdrop-blur">{tag}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-paper/65">
                <Icon name="pin" className="h-3.5 w-3.5 text-copper" /> {project.location} · {project.year}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-copper" />
              <span className="eyebrow text-copper-deep">FEATURED PROJECT / ۰۵</span>
            </div>
            <h2 className="balance mt-4 text-[clamp(1.4rem,2.6vw,2.1rem)] font-extrabold leading-[1.45] text-ink">{project.title}</h2>
            <p className="mt-3 text-[12.5px] leading-8 text-mocha/85">{project.summary}</p>
            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-espresso/10 py-5">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <span className="num block text-lg font-semibold text-copper-deep md:text-xl">{m.value}</span>
                  <span className="mt-1 block text-[9.5px] leading-5 text-mocha/65">{m.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button to="/projects" iconEnd="arrowLeft">مشاهدهٔ همهٔ پروژه‌ها</Button>
              <Button to="/contact" variant="ghost" icon="message">درخواست پروژهٔ مشابه</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-y border-espresso/[0.07] bg-paper-2 py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          eyebrow="CLIENT VOICES / ۰۶"
          title="اعتماد، ساختهٔ عملکرد است"
          description="آنچه مدیران تولید و عملیات دربارهٔ همکاری با آرکا می‌گویند."
          action={
            <div className="flex items-center gap-3 rounded-md border border-espresso/10 bg-[#fffdf8] px-4 py-2.5">
              <span className="num text-lg font-semibold text-copper-deep">۴٫۹</span>
              <div>
                <div className="flex gap-0.5 text-copper">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} viewBox="0 0 20 20" className="h-3 w-3 fill-current"><path d="m10 1.6 2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.6l-5.1 2.7 1-5.7-4.1-4 5.7-.8L10 1.6Z" /></svg>
                  ))}
                </div>
                <span className="mt-0.5 block text-[9px] text-mocha/60">امتیاز ۴۸۰ پروژه</span>
              </div>
            </div>
          }
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-lg border border-espresso/10 bg-[#fffdf8] p-6">
                <Icon name="quote" className="h-7 w-7 text-copper/40" />
                <blockquote className="mt-4 flex-1 text-[12.5px] leading-8 text-coffee/85">«{t.quote}»</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-espresso/[0.08] pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-[11px] font-semibold text-copper">{t.initials}</span>
                  <div>
                    <span className="block text-[11.5px] font-bold text-ink">{t.name}</span>
                    <span className="mt-0.5 block text-[10px] text-mocha/65">{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journal() {
  const { articles } = useStore();
  return (
    <section className="py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          eyebrow="ARKA JOURNAL / ۰۷"
          title="دانش فنی، در خدمت انتخاب بهتر"
          description="یادداشت‌های تیم مهندسی دربارهٔ رست، آسیاب، استخراج و نگهداشت تجهیزات صنعتی."
          action={<Button to="/articles" variant="outline" iconEnd="arrowLeft">همهٔ مقالات</Button>}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => (
            <Reveal key={a.id} delay={i * 90}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-copper text-white">
      <div className="tech-grid-dark absolute inset-0 opacity-70" />
      <div className="wrap relative pb-24 pt-12 md:py-16">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="eyebrow text-[8.5px] text-espresso/70">START YOUR PROJECT / ۰۸</span>
            <h2 className="balance mt-3 text-[clamp(1.5rem,3.2vw,2.4rem)] font-extrabold leading-[1.45]">
              برای انتخاب درست تجهیزات، با یک گفتگوی فنی شروع کنید.
            </h2>
            <p className="mt-3 max-w-xl text-[12.5px] leading-7 text-white/80">
              ظرفیت تولید، فضا و بودجهٔ خود را بگویید؛ پیشنهاد فنی شامل مدل دستگاه، چیدمان و برنامهٔ راه‌اندازی
              را دریافت کنید. مشاورهٔ اولیه رایگان است.
            </p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-2.5">
            <Button to="/contact" variant="dark" size="lg" iconEnd="arrowLeft" className="w-full">ثبت درخواست مشاوره</Button>
            <CatalogButton variant="light" size="lg" label="دانلود کاتالوگ محصولات" />
            <a href="tel:+982155904210" className="mt-1 flex items-center justify-center gap-2 text-[12px] font-semibold text-white/90 transition hover:text-espresso">
              <Icon name="phone" className="h-4 w-4" /> ۰۲۱-۵۵۹۰۴۲۱{"‌"}۰
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <Categories />
      <FeaturedProducts />
      <Capabilities />
      <Process />
      <CaseStudy />
      <Testimonials />
      <Journal />
      <CtaBand />
    </>
  );
}
