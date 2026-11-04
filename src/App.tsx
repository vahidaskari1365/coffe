import { useEffect } from "react";
import { RouterProvider, useRouter } from "@/lib/router";
import { StoreProvider, useStore } from "@/lib/store";
import { Header, Footer, FloatingActions } from "@/components/Layout";
import { PageHero, Button, Icon } from "@/components/ui";
import HomePage from "@/pages/Home";
import ProductsPage from "@/pages/Products";
import ProductDetailPage from "@/pages/ProductDetail";
import TechnologyPage from "@/pages/Technology";
import ProjectsPage from "@/pages/Projects";
import ArticlesPage from "@/pages/Articles";
import ArticleDetailPage from "@/pages/ArticleDetail";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import AdminPage from "@/pages/Admin";
import { CATEGORIES } from "@/data";

const BASE_DESCRIPTION =
  "آرکا صنعت قهوه؛ طراحی، ساخت و تأمین ماشین‌آلات صنعتی قهوه شامل رستور، آسیاب، دستگاه اسپرسو، سیستم استخراج و خطوط بسته‌بندی. مشاوره فنی، دانلود کاتالوگ و پروژه‌های تخصصی.";

function SeoManager() {
  const { pathname } = useRouter();
  const { products, articles } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    let title = "آرکا صنعت قهوه | تجهیزات و ماشین‌آلات صنعتی قهوه";
    let description = BASE_DESCRIPTION;

    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "products" && segments[1]) {
      const product = products.find((p) => p.slug === segments[1]);
      if (product) {
        title = `${product.name} | ${product.capacity} | آرکا صنعت قهوه`;
        description = `${product.tagline} — ${product.description.slice(0, 130)}`;
      }
    } else if (segments[0] === "products") {
      title = "محصولات و تجهیزات صنعتی قهوه | آرکا";
      description =
        "کاتالوگ کامل تجهیزات صنعتی قهوه آرکا: رستور صنعتی، آسیاب، اسپرسو سه‌گروه، خطوط استخراج و بسته‌بندی. مشخصات فنی، دانلود کاتالوگ و استعلام قیمت.";
    } else if (segments[0] === "technology") {
      title = "فناوری‌ها و فرآیند تولید قهوه | آرکا";
      description =
        "از ارزیابی دانهٔ سبز و توسعهٔ پروفایل رست تا آسیاب دقیق، استخراج و بسته‌بندی با نیتروژن؛ فناوری‌ها و استانداردهای مهندسی آرکا را بشناسید.";
    } else if (segments[0] === "projects") {
      title = "پروژه‌ها و نمونه‌کارهای صنعتی | آرکا";
      description =
        "نمونه پروژه‌های رستوری، کافه‌های زنجیره‌ای و کارخانه‌های فرآوری قهوه که با تجهیزات و مشاورهٔ فنی آرکا اجرا شده‌اند.";
    } else if (segments[0] === "articles" && segments[1]) {
      const article = articles.find((a) => a.slug === segments[1]);
      if (article) {
        title = `${article.title} | مجلهٔ آرکا`;
        description = article.excerpt;
      }
    } else if (segments[0] === "articles") {
      title = "مقالات تخصصی قهوه | مجلهٔ آرکا";
      description =
        "تحلیل‌ها و راهنماهای فنی دربارهٔ پروفایل رست، انتخاب آسیاب صنعتی، استخراج سرد، بسته‌بندی و نگهداشت تجهیزات قهوه.";
    } else if (segments[0] === "about") {
      title = "دربارهٔ آرکا | مهندسی تجهیزات قهوه از ۱۳۹۲";
      description =
        "داستان آرکا صنعت قهوه، ارزش‌ها و مسیر ساخت تجهیزات فرآوری قهوه؛ بیش از ۴۸۰ تجهیز نصب‌شده و ۲۸ استان تحت پوشش.";
    } else if (segments[0] === "contact") {
      title = "تماس، خرید و مشاورهٔ فنی | آرکا";
      description =
        "فرم درخواست خرید و مشاورهٔ فنی تجهیزات قهوه؛ تماس با کارشناسان آرکا برای انتخاب ظرفیت، استعلام قیمت و دانلود کاتالوگ.";
    } else if (segments[0] === "admin") {
      title = "پنل مدیریت محتوا | آرکا";
      description = "مدیریت محصولات، مقالات و درخواست‌های مشتریان در پنل محتوای آرکا.";
    }

    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    const origin = window.location.origin;
    const absolute = (src: string) => (/^https?:/.test(src) ? src : `${origin}/${src.replace(/^\//, "")}`);
    let schema: Record<string, unknown> | null = null;
    if (segments[0] === "products" && segments[1]) {
      const product = products.find((p) => p.slug === segments[1]);
      if (product) {
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          alternateName: product.latin,
          description: product.description,
          image: absolute(product.image),
          category: CATEGORIES.find((c) => c.id === product.category)?.title,
          brand: { "@type": "Brand", name: "آرکا صنعت قهوه" },
          manufacturer: { "@type": "Organization", name: "آرکا صنعت قهوه" },
          additionalProperty: product.specs.map((spec) => ({
            "@type": "PropertyValue",
            name: spec.label,
            value: spec.value,
          })),
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            priceCurrency: "IRR",
            url: `${origin}/#/products/${product.slug}`,
            seller: { "@type": "Organization", name: "آرکا صنعت قهوه" },
          },
        };
      }
    } else if (segments[0] === "articles" && segments[1]) {
      const article = articles.find((a) => a.slug === segments[1]);
      if (article) {
        schema = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: absolute(article.image),
          author: { "@type": "Organization", name: article.author },
          publisher: { "@type": "Organization", name: "آرکا صنعت قهوه" },
          articleSection: article.category,
          inLanguage: "fa-IR",
        };
      }
    } else if (!segments.length) {
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "آرکا صنعت قهوه",
        url: origin,
        inLanguage: "fa-IR",
        description: BASE_DESCRIPTION,
      };
    }
    const existing = document.getElementById("dynamic-schema");
    if (existing) existing.remove();
    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "dynamic-schema";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [pathname, products, articles]);

  return null;
}

function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404 / PAGE NOT FOUND"
        title="این صفحه در خط تولید نیست"
        description="آدرسی که دنبال آن بودید پیدا نشد. می‌توانید از کاتالوگ تجهیزات شروع کنید یا با تیم فنی آرکا در تماس باشید."
        crumb="صفحهٔ یافت نشد"
      />
      <div className="wrap flex flex-col items-center py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-copper/10 text-copper">
          <Icon name="search" className="h-7 w-7" />
        </span>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button to="/products" iconEnd="arrowLeft">مشاهدهٔ محصولات</Button>
          <Button to="/" variant="outline">بازگشت به خانه</Button>
          <Button to="/contact" variant="ghost">تماس با ما</Button>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <Button key={cat.id} to={`/products?cat=${cat.id}`} variant="outline" size="sm">
              {cat.title}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}

function Routes() {
  const { pathname } = useRouter();

  if (pathname === "/") return <HomePage />;
  if (pathname === "/products") return <ProductsPage />;
  if (pathname.startsWith("/products/")) return <ProductDetailPage />;
  if (pathname === "/technology") return <TechnologyPage />;
  if (pathname === "/projects") return <ProjectsPage />;
  if (pathname === "/articles") return <ArticlesPage />;
  if (pathname.startsWith("/articles/")) return <ArticleDetailPage />;
  if (pathname === "/about") return <AboutPage />;
  if (pathname === "/contact") return <ContactPage />;
  return <NotFound />;
}

function Shell() {
  const { pathname } = useRouter();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return (
      <>
        <SeoManager />
        <AdminPage />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SeoManager />
      <a
        href="#main-content"
        className="sr-only z-[200] focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:rounded-md focus:bg-espresso focus:px-4 focus:py-2.5 focus:text-[12px] focus:font-bold focus:text-paper"
      >
        پرش به محتوای اصلی
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Routes />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </RouterProvider>
  );
}
