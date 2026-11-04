# آرکا صنعت قهوه — ARKA Coffee Machinery

وب‌سایت اختصاصی تجهیزات و ماشین‌آلات صنعت قهوه؛ طراحی مدرن، صنعتی و کاملاً واکنش‌گرا (RTL).

A responsive Persian (RTL) marketing website for industrial coffee machinery, built with **React + Vite + Tailwind CSS**. No backend is required — all content is managed in the browser and stored in `localStorage`.

---

## ✨ امکانات

| بخش | توضیح |
|---|---|
| صفحه اصلی | هیرو صنعتی، دسته‌بندی تجهیزات، محصولات منتخب، فناوری‌ها، پروژهٔ شاخص، نظرات مشتریان و مقالات |
| محصولات | کاتالوگ کامل با جستجو، فیلتر دسته‌بندی، مرتب‌سازی و صفحهٔ اختصاصی هر دستگاه (گالری، مشخصات فنی، قابلیت‌ها، کاربردها) |
| کاتالوگ و دیتاشیت | دانلود فایل‌های **PDF و HTML** از پوشهٔ `public/downloads` (داخل همین مخزن) |
| فناوری‌ها | چهار مرحلهٔ فرآیند: ارزیابی دانه، رست، آسیاب، استخراج و بسته‌بندی + استانداردها و پرسش‌های متداول |
| پروژه‌ها | نمونه‌کارهای صنعتی با متریک، دامنهٔ خدمات و متدولوژی اجرا |
| مقالات | آرشیو تخصصی با فیلتر دسته، خوانندهٔ مقاله با نوار پیشرفت، فهرست مطالب و مطالب مرتبط |
| دربارهٔ ما / تماس | داستان برند، ارزش‌ها، گواهی‌ها و فرم درخواست خرید و مشاورهٔ فنی با اعتبارسنجی |
| پنل مدیریت `/admin` | داشبورد، مدیریت کامل محصولات و مقالات (افزودن/ویرایش/حذف)، مدیریت درخواست‌ها با وضعیت و خروجی CSV، تنظیمات و بازنشانی محتوا |
| سئو | عنوان و description اختصاصی هر صفحه، Open Graph، JSON-LD برای Product / Article / WebSite و ساختار semantic |

> **بدون پایگاه داده:** محصولات، مقالات و درخواست‌های ثبت‌شده در `localStorage` مرورگر ذخیره می‌شوند. کد ساختار داده آمادهٔ اتصال به API است.

---

## 🖼️ تصاویر و فایل‌های دانلودی

تمام تصاویر داخل فرانت‌اند و داخل همین مخزن قرار دارند (هیچ درخواست خارجی برای تصویر یا فونت ارسال نمی‌شود):

- `public/images/` — ۱۸ تصویر (۵ تصویر تولیدشدهٔ اختصاصی + ۱۳ عکس دانه/رستوری/کافه)
- `public/fonts/` — فونت Vazirmatn و IBM Plex Mono به‌صورت WOFF2 (میزبانی محلی)
- `public/downloads/` — کاتالوگ کامل + ۸ برگهٔ فنی، هر یک در دو فرمت:
  - `ARKA-Product-Catalog.pdf` · `ARKA-Product-Catalog.html`
  - `ARKA-<slug>-datasheet.pdf` · `ARKA-<slug>-datasheet.html`

دکمه‌های «دانلود کاتالوگ» و «دانلود برگهٔ فنی» همین فایل‌های موجود در مخزن را تحویل می‌دهند. برای محصولاتی که در پنل مدیریت ساخته می‌شوند، فایل به‌صورت لحظه‌ای در مرورگر تولید و دانلود می‌شود.

### بازتولید فایل‌های کاتالوگ

```bash
# ۱) تولید فایل‌های HTML از داده‌های محصولات
npx esbuild scripts/generate-catalogs.ts --bundle --platform=node --format=esm --outfile=/tmp/generate-catalogs.mjs
node /tmp/generate-catalogs.mjs

# ۲) تبدیل HTML به PDF (با Chrome/Chromium نصب‌شده)
for f in public/downloads/*.html; do
  chrome --headless=new --no-pdf-header-footer \
    --print-to-pdf="${f%.html}.pdf" "file://$PWD/$f"
done
```

---

## 🚀 اجرا

```bash
npm install
npm run dev       # محیط توسعه
npm run build     # خروجی production در dist/
npm run preview   # پیش‌نمایش خروجی
```

---

## 🧭 مسیرها

| مسیر | صفحه |
|---|---|
| `/` | خانه |
| `/products` · `/products/:slug` | کاتالوگ و صفحهٔ محصول |
| `/technology` | فناوری‌ها و فرآیند |
| `/projects` | پروژه‌ها |
| `/articles` · `/articles/:slug` | مقالات و خوانندهٔ مقاله |
| `/about` · `/contact` | دربارهٔ ما و تماس/مشاوره |
| `/admin` | پنل مدیریت محتوا |

مسیریابی به‌صورت hash-based است تا در GitHub Pages و هر هاست استاتیک دیگری بدون تنظیم rewrite کار کند.

---

## ☁️ انتشار روی GitHub Pages

مخزن شامل workflow آماده در `.github/workflows/deploy.yml` است. پس از هر push روی شاخهٔ `main`:

1. در GitHub به **Settings → Pages** بروید.
2. در بخش **Build and deployment → Source** گزینهٔ **GitHub Actions** را انتخاب کنید.
3. سایت روی `https://<username>.github.io/coffe/` منتشر می‌شود.

> در `vite.config.ts` مقدار `base` روی مسیر مخزن تنظیم است تا فایل‌های `images/` و `downloads/` در GitHub Pages درست بارگذاری شوند.

---

## 🎨 هویت بصری

| نقش | رنگ |
|---|---|
| Espresso / متن اصلی | `#171009` |
| Coffee / سطوح تیره | `#33231a` |
| Copper / رنگ برند | `#c2874c` — `#a46933` |
| Paper / پس‌زمینه | `#f8f3ea` |
| Sand / خطوط و مرزها | `#ddcbb2` |
| Olive / وضعیت موفق | `#5a6950` |

فونت فارسی: **Vazirmatn** — اعداد و کدها: **IBM Plex Mono**

---

## 🗂️ ساختار پروژه

```
src/
├── App.tsx               # مسیریابی، SEO و layout
├── data.ts               # مدل داده و محتوای اولیه
├── components/
│   ├── Layout.tsx        # هدر، فوتر، منو و اکشن‌های شناور
│   ├── ui.tsx            # آیکون، دکمه، کارت، مودال، ...
│   └── InquiryForm.tsx   # فرم درخواست خرید و مشاوره
├── lib/
│   ├── router.tsx        # روتر سبک hash-based
│   ├── store.tsx         # state، localStorage و درخواست‌ها
│   └── catalog.ts        # تولید کاتالوگ/دیتاشیت
└── pages/                # خانه، محصولات، فناوری، پروژه‌ها، مقالات، درباره، تماس، مدیریت
```

---

## 🔒 نکتهٔ امنیتی

پنل `/admin` در این نسخه یک **دموی سمت کلاینت** است و احراز هویت واقعی ندارد؛ برای استفادهٔ عملیاتی باید به API و سیستم ورود متصل شود. هرگز توکن‌های دسترسی را داخل مخزن قرار ندهید.

---

© آرکا صنعت قهوه — ARKA Coffee Machinery
