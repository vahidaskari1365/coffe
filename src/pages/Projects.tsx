import { CLIENTS, PROJECTS, STATS } from "@/data";
import { Badge, Button, CatalogButton, Icon, PageHero, Reveal } from "@/components/ui";
import { cn } from "@/utils/cn";

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="PROJECTS & CASE STUDIES / پروژه‌ها"
        title="پروژه‌هایی که در فنجان دیده می‌شوند"
        description="از یک رستوری کوچک تا خط تولید ۵۵۰ کیلوگرمی؛ هر پروژهٔ آرکا با تحلیل ظرفیت، انتخاب تجهیزات و برنامهٔ راه‌اندازی آغاز می‌شود و با آموزش و پشتیبانی ادامه پیدا می‌کند."
        crumb="پروژه‌ها"
        aside={
          <div className="grid w-full max-w-sm grid-cols-2 gap-2">
            <div className="rounded-md border border-paper/12 bg-paper/[0.04] p-3.5">
              <span className="num block text-xl font-semibold text-copper">۴۸۰+</span>
              <span className="mt-1 block text-[9.5px] text-paper/45">تجهیز نصب‌شده</span>
            </div>
            <div className="rounded-md border border-paper/12 bg-paper/[0.04] p-3.5">
              <span className="num block text-xl font-semibold text-copper">۲۸</span>
              <span className="mt-1 block text-[9.5px] text-paper/45">استان و کشور</span>
            </div>
            <div className="rounded-md border border-paper/12 bg-paper/[0.04] p-3.5">
              <span className="num block text-xl font-semibold text-copper">۹۸٪</span>
              <span className="mt-1 block text-[9.5px] text-paper/45">رضایت پس از تحویل</span>
            </div>
            <div className="rounded-md border border-paper/12 bg-paper/[0.04] p-3.5">
              <span className="num block text-xl font-semibold text-copper">۱۲</span>
              <span className="mt-1 block text-[9.5px] text-paper/45">سال تجربهٔ مهندسی</span>
            </div>
          </div>
        }
      />

      <section className="py-14 md:py-20">
        <div className="wrap space-y-16 md:space-y-24">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.id} as="article" className="grid items-center gap-7 lg:grid-cols-2 lg:gap-12">
              <div className={cn("relative", i % 2 === 1 && "lg:order-2")}>
                <div className="relative overflow-hidden rounded-lg border border-espresso/10">
                  <img src={project.image} alt={project.title} loading="lazy" className="h-[280px] w-full object-cover md:h-[400px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/5 to-transparent" />
                  <div className="absolute right-4 top-4"><span className="num rounded bg-paper/90 px-2 py-1 text-[9px] font-semibold tracking-widest text-coffee">PRJ-{String(i + 1).padStart(2, "0")}</span></div>
                  <div className="absolute bottom-4 right-4 left-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded border border-paper/25 bg-espresso/40 px-2 py-1 text-[9.5px] text-paper backdrop-blur">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-md bg-copper px-3.5 py-2.5 text-white shadow-xl">
                  <Icon name="pin" className="h-3.5 w-3.5" />
                  <span className="text-[10.5px] font-semibold">{project.location}</span>
                  <span className="h-3 w-px bg-white/30" />
                  <span className="num text-[10px]">{project.year}</span>
                </div>
              </div>

              <div className={cn(i % 2 === 1 && "lg:order-1")}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="outline">{project.client}</Badge>
                  <span className="eyebrow text-[8px] text-mocha/45">{project.scope}</span>
                </div>
                <h2 className="balance mt-3 text-[clamp(1.35rem,2.7vw,2.15rem)] font-extrabold leading-[1.45] text-ink">{project.title}</h2>
                <p className="mt-3 text-[12.5px] leading-8 text-mocha/85">{project.summary}</p>
                <div className="mt-6 grid grid-cols-3 divide-x divide-x-reverse divide-espresso/10 rounded-md border border-espresso/10 bg-[#fffdf8] py-4">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="px-2.5 text-center">
                      <span className="num block text-base font-semibold text-copper-deep md:text-lg">{m.value}</span>
                      <span className="mt-1 block text-[9px] leading-5 text-mocha/65">{m.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button to="/contact" size="sm" iconEnd="arrowLeft">درخواست پروژهٔ مشابه</Button>
                  <Button to="/products" variant="outline" size="sm">تجهیزات این پروژه</Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-espresso py-14 text-paper md:py-20">
        <div className="tech-grid-dark absolute inset-0" />
        <div className="wrap relative">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="eyebrow text-[8.5px] text-amber">PROJECT METHODOLOGY</span>
              <h2 className="mt-3 text-[clamp(1.4rem,2.8vw,2.1rem)] font-extrabold leading-[1.45]">یک پروژهٔ موفق، از تحلیل شروع می‌شود</h2>
              <p className="mt-3 max-w-xl text-[12px] leading-7 text-paper/55">
                پیش از پیشنهاد دستگاه، چهار پرسش را با هم پاسخ می‌دهیم: چه می‌خواهید تولید کنید، چه ظرفیتی لازم
                دارید، فضای شما چه محدودیتی دارد و تیم شما با چه سطحی از اتوماسیون راحت است؟
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button to="/contact" iconEnd="arrowLeft">شروع گفتگو</Button>
                <CatalogButton variant="light" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { n: "۰۱", t: "تحلیل نیاز", d: "محاسبهٔ ظرفیت، محصول هدف و بودجه" },
                { n: "۰۲", t: "پیشنهاد فنی", d: "انتخاب مدل، چیدمان و زیرساخت مورد نیاز" },
                { n: "۰۳", t: "تأمین و نصب", d: "زمان‌بندی تحویل، استقرار و کالیبراسیون" },
                { n: "۰۴", t: "تحویل و پشتیبانی", d: "آزمون عملکرد، آموزش و سرویس دوره‌ای" },
              ].map((step) => (
                <div key={step.n} className="rounded-md border border-paper/10 bg-paper/[0.035] p-4">
                  <div className="flex items-center justify-between">
                    <span className="num text-[11px] text-copper">{step.n}</span>
                    <Icon name="check" className="h-3.5 w-3.5 text-olive" />
                  </div>
                  <h3 className="mt-2.5 text-[12px] font-bold">{step.t}</h3>
                  <p className="mt-1 text-[10px] leading-5 text-paper/45">{step.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-paper/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-[10px] text-paper/40">همراهان و مشتریان ما در سراسر کشور</span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {CLIENTS.slice(0, 5).map((c) => (
                  <span key={c} className="flex items-center gap-1.5 text-[11px] font-semibold text-paper/55">
                    <Icon name="coffee" className="h-3 w-3 text-copper/60" /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="wrap grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-espresso/10 bg-[#fffdf8] px-4 py-4 text-center">
              <span className="num text-xl font-semibold text-copper-deep">{s.value}{s.suffix}</span>
              <span className="mt-1 block text-[10px] text-mocha/65">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
