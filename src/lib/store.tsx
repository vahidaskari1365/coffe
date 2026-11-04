import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ARTICLES, CATEGORIES, PRODUCTS, type Article, type Inquiry, type Product } from "@/data";
import {
  buildCatalogHtml,
  downloadBlob,
  downloadStatic,
  STATIC_CATALOG_HTML,
  STATIC_CATALOG_PDF,
  STATIC_DATASHEET_SLUGS,
  staticDatasheetHtml,
  staticDatasheetPdf,
} from "./catalog";

const STORAGE_KEY = "arka.content.v1";

type ContentState = {
  products: Product[];
  articles: Article[];
  inquiries: Inquiry[];
};

export type ToastKind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: ToastKind };

type StoreValue = ContentState & {
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  saveArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "status" | "createdAt">) => string;
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => void;
  deleteInquiry: (id: string) => void;
  resetContent: () => void;
  downloadCatalog: (product?: Product, format?: "pdf" | "html") => void;
  notify: (message: string, kind?: ToastKind) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const seedInquiries: Inquiry[] = [
  {
    id: "ARK-1042",
    name: "رضا احمدی",
    company: "رستوری آرامش",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    email: "r.ahmadi@example.com",
    product: "رستور صنعتی ۶۰ کیلوگرمی آر-۶۰",
    capacity: "۲۰۰ تا ۵۰۰ کیلوگرم در هفته",
    message: "برای توسعهٔ رستوری به ظرفیت ۲ تن در ماه نیاز به مشاورهٔ چیدمان و قیمت داریم.",
    source: "صفحهٔ محصول",
    status: "review",
    createdAt: "2025-04-18",
  },
  {
    id: "ARK-1043",
    name: "مریم حسینی",
    company: "کافهٔ نقطه",
    phone: "۰۹۳۵۹۸۷۶۵۴۳",
    email: "maryam@noghte.cafe",
    product: "دستگاه اسپرسو سه‌گروه بار-۳",
    capacity: "۳۰۰ فنجان در روز",
    message: "برای شعبهٔ جدید به اسپرسو سه‌گروه، آسیاب و تصفیهٔ آب نیاز داریم.",
    source: "فرم مشاوره",
    status: "new",
    createdAt: "2025-05-02",
  },
];

function loadState(): ContentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { products: PRODUCTS, articles: ARTICLES, inquiries: seedInquiries };
    const parsed = JSON.parse(raw) as Partial<ContentState>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : PRODUCTS,
      articles: Array.isArray(parsed.articles) ? parsed.articles : ARTICLES,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : seedInquiries,
    };
  } catch {
    return { products: PRODUCTS, articles: ARTICLES, inquiries: seedInquiries };
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ContentState>(() =>
    typeof window === "undefined" ? { products: PRODUCTS, articles: ARTICLES, inquiries: seedInquiries } : loadState(),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage might be unavailable */
    }
  }, [state]);

  const notify = useCallback((message: string, kind: ToastKind = "success") => {
    const id = toastId.current++;
    setToasts((prev) => [...prev.slice(-2), { id, message, kind }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  const saveProduct = useCallback(
    (product: Product) => {
      setState((prev) => {
        const exists = prev.products.some((p) => p.id === product.id);
        return {
          ...prev,
          products: exists ? prev.products.map((p) => (p.id === product.id ? product : p)) : [product, ...prev.products],
        };
      });
      notify(productsSavedMessage("محصول"));
    },
    [notify],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
      notify("محصول حذف شد.", "info");
    },
    [notify],
  );

  const saveArticle = useCallback(
    (article: Article) => {
      setState((prev) => {
        const exists = prev.articles.some((a) => a.id === article.id);
        return {
          ...prev,
          articles: exists ? prev.articles.map((a) => (a.id === article.id ? article : a)) : [article, ...prev.articles],
        };
      });
      notify("مقاله ذخیره شد.");
    },
    [notify],
  );

  const deleteArticle = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, articles: prev.articles.filter((a) => a.id !== id) }));
      notify("مقاله حذف شد.", "info");
    },
    [notify],
  );

  const addInquiry = useCallback(
    (inquiry: Omit<Inquiry, "id" | "status" | "createdAt">) => {
      const id = `ARK-${Math.floor(1044 + Math.random() * 8900)}`;
      const record: Inquiry = {
        ...inquiry,
        id,
        status: "new",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setState((prev) => ({ ...prev, inquiries: [record, ...prev.inquiries] }));
      notify("درخواست شما ثبت شد. کارشناسان آرکا تماس می‌گیرند.");
      return id;
    },
    [notify],
  );

  const updateInquiryStatus = useCallback((id: string, status: Inquiry["status"]) => {
    setState((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
    }));
  }, []);

  const deleteInquiry = useCallback((id: string) => {
    setState((prev) => ({ ...prev, inquiries: prev.inquiries.filter((i) => i.id !== id) }));
  }, []);

  const resetContent = useCallback(() => {
    setState({ products: PRODUCTS, articles: ARTICLES, inquiries: seedInquiries });
    notify("محتوای نمایشی به حالت اولیه بازگشت.", "info");
  }, [notify]);

  const downloadCatalog = useCallback(
    (product?: Product, format: "pdf" | "html" = "pdf") => {
      const label = format === "pdf" ? "PDF" : "HTML";

      // 1) Permanent files committed inside /public/downloads
      if (product) {
        if (STATIC_DATASHEET_SLUGS.has(product.slug)) {
          const href = format === "pdf" ? staticDatasheetPdf(product.slug) : staticDatasheetHtml(product.slug);
          downloadStatic(href, `ARKA-${product.slug}-datasheet.${format}`);
          notify(`برگهٔ فنی ${label} از مخزن دانلود شد.`);
          return;
        }
        // 2) Custom (CMS-created) products are generated in the browser
        const html = buildCatalogHtml(state.products, product, {
          imageBase: `${window.location.origin}/images/`,
          fontHref: `${window.location.origin}/fonts/fonts.css`,
        });
        downloadBlob(`ARKA-${product.slug}-datasheet.html`, html);
        notify("برگهٔ مشخصات فنی سفارشی دانلود شد.");
        return;
      }

      downloadStatic(format === "pdf" ? STATIC_CATALOG_PDF : STATIC_CATALOG_HTML, `ARKA-Product-Catalog.${format}`);
      notify("کاتالوگ کامل محصولات دانلود شد.");
    },
    [state.products, notify],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      saveProduct,
      deleteProduct,
      saveArticle,
      deleteArticle,
      addInquiry,
      updateInquiryStatus,
      deleteInquiry,
      resetContent,
      downloadCatalog,
      notify,
    }),
    [
      state,
      saveProduct,
      deleteProduct,
      saveArticle,
      deleteArticle,
      addInquiry,
      updateInquiryStatus,
      deleteInquiry,
      resetContent,
      downloadCatalog,
      notify,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[120] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
              toast.kind === "error"
                ? "border-red-200 bg-red-50/95 text-red-800"
                : toast.kind === "info"
                  ? "border-sand bg-coal/95 text-paper"
                  : "border-copper/40 bg-coffee text-paper"
            }`}
          >
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                toast.kind === "error" ? "bg-red-500" : toast.kind === "info" ? "bg-copper" : "bg-amber"
              }`}
            />
            <span className="leading-7">{toast.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

function productsSavedMessage(kind: string) {
  return `${kind} با موفقیت ذخیره شد.`;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useCategoryName(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.title ?? id;
}
