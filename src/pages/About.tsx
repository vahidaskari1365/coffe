import { COMPANY, IMG, STATS, CERTIFICATIONS } from "@/data";
import { Badge, Button, CatalogButton, Icon, PageHero, Reveal, SectionHead, type IconName } from "@/components/ui";

const timeline = [
  { year: "۱۳۹۲", title: "آغاز در یک کارگاه کوچک", text: "با بازسازی و نگهداشت تجهیزات قهوه، اولین تجربه‌های مهندسی آرکا شکل گرفت." },
  { year: "۱۳۹۶", title: "ساخت اولین رستور صنعتی", text: "طراحی درام و سیستم حرارتی اختصاصی، با هدف تکرارپذیری پروفایل رست." },
  { year: "۱۳۹۹", title: "توسعهٔ خطوط کامل", text: "ورود به پروژه‌های کلید در دست؛ از آسیاب و بسته‌بندی تا طراحی چیدمان." },
  { year: "۱۴۰۲", title: "شروع همکاری صادراتی", text: "اجرای پروژه‌های رستوری در عمان و توسعهٔ شبکهٔ تأمین قطعات." },
  { year: "۱۴۰۴", title: "مرکز فنی و آموزش", text: "افتتاح مرکز پایش کیفیت و آموزش اپراتور در تهران." },
];

const values: { icon: IconName; title: string; text: string }[] = [
  { icon: "target", title: "دقت مهندسی", text: "هر عدد در پیشنهاد فنی ما قابل توضیح و اندازه‌گیری است." },
  { icon: "users", title: "همراهی واقعی", text: "تا زمانی که تیم شما با تجهیزات راحت نشود، پروژه تمام نشده است." },
  { icon: "shield", title: "مسئولیت‌پذیری", text: "شفافیت در مشخصات، زمان‌بندی و شرایط گارانتی، اصل کار ماست." },
  { icon: "sparkle", title: "یادگیری مستمر", text: "دانش قهوه در حال تغییر است؛ ما هم همراه آن به‌روز می‌شویم." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ARKA / دربارهٔ ما"
        title="مهندسانی که برای قهوه ابزار می‌سازند"
        description="آرکا صنعت قهوه از سال ۱۳۹۲ با یک هدف شروع شد: ساختن تجهیزاتی که کیفیت طعم را به حافظهٔ اپراتور وابسته نکنند. امروز بیش از ۴۸۰ خط و تجهیز در کسب‌وکارهای قهوه ایران و منطقه فعال است."
        crumb="دربارهٔ ما"
        aside={<div className="rounded-lg border border-paper/15 bg-paper/[0.04] px-5 py-4"><span className="eyebrow text-[7.5px] text-copper">OUR PROMISE</span><p className="mt-2 max-w-[220px] text-[12px] font-medium leading-7 text-paper/80">تجهیز، آموزش، نگهداشت؛ در یک رابطهٔ بلندمدت.</p></div>}
      />

      <section className="py-16 md:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3">
              <img src={IMG.roasterMan} alt="کارگاه ساخت تجهیزات قهوه" loading="lazy" className="col-span-2 h-[250px] w-full rounded-lg object-cover md:h-[320px]" />
              <img src={IMG.beansInRoaster} alt="دانهٔ قهوه در رستور" loading="lazy" className="h-[150px] w-full rounded-lg object-cover md:h-[190px]" />
              <img src={IMG.control} alt="کنترل کیفیت فرآیند رست" loading="lazy" className="h-[150px] w-full rounded-lg object-cover md:h-[190px]" />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-lg bg-copper px-4 py-3 text-white shadow-xl">
              <span className="num text-2xl font-semibold">۱۲+</span>
              <span className="text-[10px] leading-5">سال تجربه<br />در صنعت قهوه</span>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <span className="eyebrow text-copper-deep">OUR STORY / ۰۱</span>
            <h2 className="balance mt-3 text-[clamp(1.5rem,3vw,2.4rem)] font-extrabold leading-[1.45] text-ink">
              از یک کارگاه بازسازی، تا یک شریک فنی صنعتی
            </h2>
            <p className="mt-4 text-[13px] leading-8 text-mocha/85">
              مسیر ما با نگهداشت تجهیزات کافه‌ها شروع شد. در سال‌های نخست فهمیدیم مشکل اصلی بسیاری از خطوط
              تولید، فقط دستگاه نیست؛ نبودِ داده، انتخاب ظرفیت نادرست و نگهداشت دیرهنگام است. آرکا را ساختیم تا
              این سه شکاف را پر کنیم.
            </p>
            <p className="mt-3 text-[13px] leading-8 text-mocha/85">
              امروز تیم ما شامل مهندسان مکانیک، برق، کنترل و کارشناسان قهوه است که در کنار هم، از طراحی چیدمان
              تا کالیبراسیون نهایی و آموزش اپراتور را انجام می‌دهند.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-md border border-espresso/10 bg-[#fffdf8] px-3.5 py-3">
                  <span className="num text-lg font-semibold text-copper-deep">{s.value}<span className="text-[11px]">{s.suffix}</span></span>
                  <span className="mt-0.5 block text-[10px] text-mocha/65">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button to="/projects" iconEnd="arrowLeft">نمونه‌کارهای ما</Button>
              <CatalogButton variant="outline" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-espresso py-16 text-paper md:py-20">
        <div className="tech-grid-dark absolute inset-0" />
        <div className="wrap relative">
          <SectionHead tone="light" eyebrow="MILESTONES / ۰۲" title="مسیر آرکا در یک نگاه" description="هر نقطهٔ این مسیر، نتیجهٔ یک پروژهٔ واقعی و بازخورد مشتریان است." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 70}>
                <div className="relative h-full rounded-lg border border-paper/10 bg-paper/[0.035] p-4">
                  <span className="num block text-[16px] font-semibold text-amber">{t.year}</span>
                  <span className="mt-2 block h-px w-7 bg-copper/50" />
                  <h3 className="mt-2.5 text-[12px] font-bold leading-6">{t.title}</h3>
                  <p className="mt-1.5 text-[10px] leading-5 text-paper/45">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="wrap">
          <SectionHead eyebrow="WHAT WE STAND FOR / ۰۳" title="چهار اصلی که کنارشان نمی‌گذاریم" description="این اصول در قراردادها و رفتار روزمرهٔ تیم فنی ما قابل مشاهده است." />
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="group rounded-lg border border-espresso/10 bg-[#fffdf8] p-5 transition hover:border-copper/35 hover:shadow-lg hover:shadow-espresso/5">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-espresso text-copper transition group-hover:bg-copper group-hover:text-white">
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[13px] font-extrabold text-ink">{v.title}</h3>
                <p className="mt-1.5 text-[11px] leading-6 text-mocha/75">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-espresso/[0.08] bg-paper-2 py-14">
        <div className="wrap grid items-center gap-9 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow text-copper-deep">QUALITY & COMPLIANCE / ۰۴</span>
            <h2 className="mt-3 text-[clamp(1.4rem,2.7vw,2.1rem)] font-extrabold leading-[1.45] text-ink">کیفیت، مستند و قابل بررسی</h2>
            <p className="mt-3 max-w-xl text-[12.5px] leading-8 text-mocha/85">
              تمام دستگاه‌های آرکا با مستندات فنی، فهرست قطعات و گزارش آزمون تحویل می‌شوند. مواد در تماس با
              محصول، مطابق استانداردهای گرید غذایی انتخاب می‌شوند و طراحی‌ها با الزامات ایمنی حرارتی و برقی
              انطباق دارند.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {CERTIFICATIONS.map((c) => (
                <div key={c.name} className="flex items-center gap-3 rounded-md border border-espresso/10 bg-[#fffdf8] px-3.5 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-olive/12 text-olive"><Icon name="shield" className="h-4 w-4" /></span>
                  <div>
                    <span className="block font-mono text-[11px] font-semibold text-coffee">{c.name}</span>
                    <span className="text-[9px] text-mocha/60">{c.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={IMG.cafeShelf} alt="تجهیزات و محصولات قهوه در فضای فروشگاه" loading="lazy" className="h-[300px] w-full rounded-lg object-cover md:h-[380px]" />
            <div className="absolute -right-3 -top-3 h-24 w-24 border-r border-t border-copper/50" aria-hidden="true" />
            <div className="absolute bottom-4 right-4 rounded-md bg-paper/95 px-4 py-3 shadow-lg backdrop-blur">
              <span className="block text-[10px] text-mocha/60">مرکز فنی و آموزش</span>
              <span className="mt-0.5 block text-[12px] font-bold text-ink">{COMPANY.address.split("،").slice(-2).join("، ")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-espresso/10 bg-[#fffdf8] p-6 md:flex-row md:items-center md:p-8">
            <div>
              <Badge tone="outline">همکاری با آرکا</Badge>
              <h2 className="mt-3 text-[clamp(1.3rem,2.4vw,1.8rem)] font-extrabold leading-[1.5] text-ink">
                به دنبال نمایندگی، همکاری فنی یا پروژهٔ صنعتی هستید؟
              </h2>
              <p className="mt-2 max-w-2xl text-[12px] leading-7 text-mocha/80">
                در زمینهٔ فروش تجهیزات، خدمات نصب و نگهداشت در شهرهای مختلف، پذیرای همکاری‌های حرفه‌ای هستیم.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button to="/contact" iconEnd="arrowLeft">فرم درخواست همکاری</Button>
              <Button to="/articles" variant="outline">مقالات فنی</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
