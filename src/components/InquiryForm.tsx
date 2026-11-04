import { useState, type ChangeEvent, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { Button, Icon } from "./ui";
import { cn } from "@/utils/cn";

const CAPACITY_OPTIONS = [
  "کمتر از ۵۰ کیلوگرم در هفته",
  "۵۰ تا ۲۰۰ کیلوگرم در هفته",
  "۲۰۰ تا ۵۰۰ کیلوگرم در هفته",
  "بیش از ۵۰۰ کیلوگرم در هفته",
  "در حال راه‌اندازی — هنوز مشخص نیست",
];

const toLatinDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

export function InquiryForm({
  initialProduct,
  compact = false,
  source = "فرم مشاوره",
  onDone,
}: {
  initialProduct?: string;
  compact?: boolean;
  source?: string;
  onDone?: () => void;
}) {
  const { products, addInquiry } = useStore();
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    product: initialProduct ?? products[0]?.name ?? "مشاورهٔ عمومی",
    capacity: CAPACITY_OPTIONS[1],
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (form.name.trim().length < 3) next.name = "نام و نام خانوادگی را کامل وارد کنید.";
    const phone = toLatinDigits(form.phone).replace(/[\s-]/g, "");
    if (!/^(\+?98|0)?9\d{9}$/.test(phone) && !/^0\d{10}$/.test(phone)) next.phone = "شمارهٔ تماس معتبر وارد کنید (مثال: ۰۹۱۲۱۲۳۴۵۶۷).";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "ایمیل معتبر وارد کنید.";
    if (!compact && form.message.trim().length < 10) next.message = "کمی دربارهٔ نیاز خود بنویسید (حداقل ۱۰ نویسه).";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    window.setTimeout(() => {
      const id = addInquiry({
        name: form.name.trim(),
        company: form.company.trim() || "—",
        phone: form.phone.trim(),
        email: form.email.trim() || "—",
        product: form.product,
        capacity: form.capacity,
        message: form.message.trim() || "درخواست مشاورهٔ تلفنی",
        source,
      });
      setReference(id);
      setSending(false);
      onDone?.();
    }, 650);
  };

  if (reference) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-olive/25 bg-olive/[0.06] px-5 py-9 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-olive/15 text-olive">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="mt-4 text-base font-extrabold text-ink">درخواست شما ثبت شد</h3>
        <p className="mt-2 max-w-sm text-[12px] leading-7 text-mocha/80">
          کارشناس فنی آرکا در ساعات کاری، حداکثر تا ۲۴ ساعت آینده با شما تماس می‌گیرد. شمارهٔ پیگیری شما:
        </p>
        <span className="num mt-3 rounded border border-espresso/15 bg-paper px-3 py-1.5 text-sm font-semibold text-coffee">{reference}</span>
        <div className="mt-6 w-full max-w-sm space-y-2 border-t border-olive/20 pt-4 text-right">
          {[
            { n: "۰۱", t: "بررسی درخواست توسط کارشناس فنی", d: "ظرفیت، فضا و نیاز شما ارزیابی می‌شود." },
            { n: "۰۲", t: "تماس و تکمیل اطلاعات", d: "حداکثر تا ۲۴ ساعت کاری آینده." },
            { n: "۰۳", t: "ارائهٔ پیشنهاد فنی و استعلام", d: "مدل پیشنهادی، چیدمان و زمان‌بندی تحویل." },
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-2.5 rounded-md bg-paper/70 px-3 py-2">
              <span className="num mt-0.5 text-[9px] font-semibold text-copper-deep">{step.n}</span>
              <div>
                <span className="block text-[10.5px] font-bold text-coffee">{step.t}</span>
                <span className="mt-0.5 block text-[9.5px] text-mocha/60">{step.d}</span>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setReference(null)} className="mt-4 text-[11px] font-semibold text-copper-deep underline underline-offset-4">
          ثبت درخواست دیگر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
      <div>
        <label className="label" htmlFor="inq-name">نام و نام خانوادگی <span className="text-copper">*</span></label>
        <input id="inq-name" className={cn("field", errors.name && "border-red-400")} value={form.name} onChange={set("name")} placeholder="مثلاً سارا محمدی" autoComplete="name" aria-invalid={!!errors.name} />
        {errors.name && <p className="mt-1 text-[10.5px] text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="label" htmlFor="inq-company">نام کسب‌وکار / شرکت</label>
        <input id="inq-company" className="field" value={form.company} onChange={set("company")} placeholder="نام کافه، رستوری یا شرکت" autoComplete="organization" />
      </div>
      <div>
        <label className="label" htmlFor="inq-phone">شمارهٔ تماس <span className="text-copper">*</span></label>
        <input id="inq-phone" dir="ltr" inputMode="tel" className={cn("field text-left placeholder:text-left", errors.phone && "border-red-400")} value={form.phone} onChange={set("phone")} placeholder="0912 123 4567" autoComplete="tel" aria-invalid={!!errors.phone} />
        {errors.phone && <p className="mt-1 text-[10.5px] text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label className="label" htmlFor="inq-email">ایمیل <span className="text-[9px] font-normal text-mocha/50">(اختیاری)</span></label>
        <input id="inq-email" dir="ltr" type="email" className={cn("field text-left placeholder:text-left", errors.email && "border-red-400")} value={form.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" aria-invalid={!!errors.email} />
        {errors.email && <p className="mt-1 text-[10.5px] text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label className="label" htmlFor="inq-product">دستگاه / موضوع درخواست</label>
        <select id="inq-product" className="field" value={form.product} onChange={set("product")}>
          <option value="مشاورهٔ عمومی و انتخاب تجهیزات">مشاورهٔ عمومی و انتخاب تجهیزات</option>
          {products.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
          <option value="راه‌اندازی خط تولید کامل">راه‌اندازی خط تولید کامل</option>
          <option value="سرویس، نگهداشت و قطعات یدکی">سرویس، نگهداشت و قطعات یدکی</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="inq-capacity">ظرفیت یا مصرف تقریبی</label>
        <select id="inq-capacity" className="field" value={form.capacity} onChange={set("capacity")}>
          {CAPACITY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {!compact && (
        <div className="sm:col-span-2">
          <label className="label" htmlFor="inq-message">توضیح نیاز شما</label>
          <textarea id="inq-message" rows={4} className={cn("field resize-y", errors.message && "border-red-400")} value={form.message} onChange={set("message")} placeholder="مثلاً: برای یک رستوری ۱۲۰ متری به رستور ۱۰ کیلویی و خط بسته‌بندی نیاز داریم؛ زمان‌بندی راه‌اندازی هم مهم است." aria-invalid={!!errors.message} />
          {errors.message && <p className="mt-1 text-[10.5px] text-red-600">{errors.message}</p>}
        </div>
      )}
      <div className={compact ? "sm:col-span-2" : "sm:col-span-2"}>
        <Button type="submit" size="lg" className="w-full" disabled={sending} iconEnd={sending ? undefined : "arrowLeft"}>
          {sending ? "در حال ارسال…" : "ثبت درخواست و دریافت مشاوره"}
        </Button>
        <p className="mt-2.5 flex items-start justify-center gap-1.5 text-center text-[9.5px] leading-5 text-mocha/60">
          <Icon name="shield" className="mt-0.5 h-3 w-3 shrink-0 text-olive" />
          اطلاعات شما محرمانه است و صرفاً برای پاسخ به همین درخواست استفاده می‌شود.
        </p>
      </div>
    </form>
  );
}
