import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/lib/router";
import { useStore } from "@/lib/store";
import { CATEGORIES, COMPANY, IMG, type Article, type Block, type CategoryId, type Inquiry, type Product } from "@/data";
import { Badge, Button, Icon, Logo, Modal, type IconName } from "@/components/ui";
import { cn } from "@/utils/cn";

type Tab = "dashboard" | "products" | "articles" | "inquiries" | "settings";

const TABS: { id: Tab; label: string; icon: IconName; latin: string }[] = [
  { id: "dashboard", label: "داشبورد", icon: "dashboard", latin: "OVERVIEW" },
  { id: "products", label: "محصولات", icon: "grid", latin: "EQUIPMENT" },
  { id: "articles", label: "مقالات", icon: "file", latin: "JOURNAL" },
  { id: "inquiries", label: "درخواست‌ها", icon: "message", latin: "REQUESTS" },
  { id: "settings", label: "تنظیمات", icon: "settings", latin: "SETTINGS" },
];

const STATUS: Record<Inquiry["status"], { label: string; cls: string; dot: string }> = {
  new: { label: "جدید", cls: "bg-copper/15 text-copper-deep border-copper/30", dot: "bg-copper" },
  review: { label: "در حال بررسی", cls: "bg-amber/15 text-[#8a5b1c] border-amber/40", dot: "bg-amber" },
  contacted: { label: "تماس گرفته شد", cls: "bg-olive/15 text-olive border-olive/30", dot: "bg-olive" },
  closed: { label: "بسته شد", cls: "bg-espresso/[0.06] text-mocha border-espresso/15", dot: "bg-mocha/50" },
};

const today = new Date().toLocaleDateString("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const faDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("fa-IR");
};

const emptyProduct = (): Product => ({
  id: "",
  slug: "",
  name: "",
  latin: "",
  category: "roaster",
  tagline: "",
  description: "",
  highlights: [],
  specs: [],
  applications: [],
  image: IMG.roaster,
  gallery: [IMG.roaster],
  featured: false,
  capacity: "",
  power: "",
});

const emptyArticle = (): Article => ({
  id: "",
  slug: "",
  title: "",
  category: "فناوری رست",
  excerpt: "",
  image: IMG.beansInRoaster,
  author: "تیم فنی آرکا",
  date: new Date().toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }),
  readTime: "۵ دقیقه",
  content: [],
});

const lines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);
const parseSpecs = (text: string) =>
  lines(text)
    .map((line) => line.split("|"))
    .filter((parts) => parts.length >= 2)
    .map(([label, ...rest]) => ({ label: label.trim(), value: rest.join("|").trim() }));
const specText = (specs: Product["specs"]) => specs.map((s) => `${s.label} | ${s.value}`).join("\n");

function serializeContent(blocks: Block[]) {
  return blocks
    .map((b) => {
      if (b.type === "h") return `## ${b.text}`;
      if (b.type === "quote") return `> ${b.text}`;
      if (b.type === "list") return b.items.map((i) => `- ${i}`).join("\n");
      return b.text;
    })
    .join("\n\n");
}

function parseContent(text: string): Block[] {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const chunkLines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
      if (chunkLines.every((l) => l.startsWith("- "))) return { type: "list", items: chunkLines.map((l) => l.slice(2)) } as Block;
      if (chunk.startsWith("## ")) return { type: "h", text: chunk.slice(3) } as Block;
      if (chunk.startsWith("> ")) return { type: "quote", text: chunk.slice(2) } as Block;
      return { type: "p", text: chunkLines.join(" ") } as Block;
    });
}

/* ------------------------------ shell ----------------------------- */
export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const { inquiries } = useStore();
  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="min-h-screen bg-[#f2ece2]">
      <div className="lg:flex">
        <aside className="bg-espresso text-paper lg:sticky lg:top-0 lg:h-screen lg:w-[248px] lg:shrink-0">
          <div className="tech-grid-dark relative">
            <div className="flex items-center justify-between px-4 py-4 lg:flex-col lg:items-start lg:gap-5 lg:px-5 lg:py-6">
              <Link to="/" aria-label="بازگشت به سایت"><Logo tone="light" compact /></Link>
              <Badge tone="copper" className="hidden lg:inline-flex">پنل مدیریت محتوا · دمو</Badge>
              <span className="rounded border border-paper/15 px-2 py-1 text-[9px] text-paper/50 lg:hidden">CMS دمو</span>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-1 px-3 pb-3 sm:grid-cols-3 lg:grid-cols-1 lg:px-3 lg:pb-0" aria-label="بخش‌های مدیریت">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-2.5 text-[11.5px] font-semibold transition lg:w-full lg:gap-2.5 lg:px-3 lg:text-[12px]",
                    active ? "bg-copper text-white" : "text-paper/60 hover:bg-paper/[0.06] hover:text-paper",
                  )}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.id === "inquiries" && newCount > 0 && (
                    <span className={cn("num rounded-full px-1.5 py-0.5 text-[9px]", active ? "bg-white/25 text-white" : "bg-copper/20 text-amber")}>{newCount}</span>
                  )}
                  <span className={cn("eyebrow mr-auto hidden text-[6.5px] lg:block", active ? "text-white/60" : "text-paper/25")}>{item.latin}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto hidden p-4 lg:block">
            <div className="rounded-md border border-paper/12 bg-paper/[0.04] p-3">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-paper/75"><Icon name="info" className="h-3.5 w-3.5 text-copper" /> حالت نمایشی</div>
              <p className="mt-1.5 text-[9px] leading-5 text-paper/40">تغییرات فقط در مرورگر شما ذخیره می‌شود. برای اتصال به سرور آماده است.</p>
            </div>
            <Link to="/" className="mt-3 flex items-center justify-center gap-2 rounded-md border border-paper/15 py-2 text-[10.5px] text-paper/60 transition hover:border-copper hover:text-copper">
              <Icon name="arrowUpLeft" className="h-3.5 w-3.5" /> مشاهدهٔ سایت
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-espresso/[0.08] bg-[#f8f4ed]/95 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-espresso text-copper lg:hidden"><Icon name="settings" className="h-4 w-4" /></span>
                <div>
                  <h1 className="text-[13px] font-extrabold text-ink">پنل مدیریت محتوا</h1>
                  <p className="mt-0.5 hidden text-[9.5px] text-mocha/60 sm:block">{today}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/" className="hidden items-center gap-1.5 rounded-md border border-espresso/15 px-2.5 py-1.5 text-[10.5px] font-semibold text-coffee transition hover:border-copper sm:flex">
                  <Icon name="arrowUpLeft" className="h-3 w-3" /> سایت
                </Link>
                <button type="button" onClick={() => setTab("inquiries")} className="relative grid h-8 w-8 place-items-center rounded-md border border-espresso/15 text-coffee transition hover:border-copper" aria-label="درخواست‌های جدید">
                  <Icon name="message" className="h-3.5 w-3.5" />
                  {newCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-copper px-0.5 text-[8px] font-bold text-white">{newCount}</span>}
                </button>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-espresso text-[10px] font-semibold text-copper">آ</span>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6 lg:p-8">
            {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
            {tab === "products" && <ProductsAdmin />}
            {tab === "articles" && <ArticlesAdmin />}
            {tab === "inquiries" && <InquiriesAdmin />}
            {tab === "settings" && <SettingsAdmin />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------------------------- dashboard --------------------------- */
function Dashboard({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { products, articles, inquiries, downloadCatalog } = useStore();
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const cards = [
    { label: "محصولات فعال", value: products.length, icon: "grid" as IconName, note: `${products.filter((p) => p.featured).length} محصول منتخب`, tab: "products" as Tab },
    { label: "مقالات منتشرشده", value: articles.length, icon: "file" as IconName, note: "آخرین به‌روزرسانی: امروز", tab: "articles" as Tab },
    { label: "درخواست‌های جدید", value: newCount, icon: "message" as IconName, note: `از مجموع ${inquiries.length} درخواست`, tab: "inquiries" as Tab },
    { label: "تجهیز نصب‌شده", value: "۴۸۰+", icon: "chart" as IconName, note: "در ۲۸ استان", tab: "dashboard" as Tab },
  ];

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-xl bg-espresso p-5 text-paper md:p-6">
        <div className="tech-grid-dark absolute inset-0" />
        <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="eyebrow text-[8px] text-copper">WELCOME BACK</span>
            <h2 className="mt-2 text-lg font-extrabold md:text-xl">سلام، تیم آرکا</h2>
            <p className="mt-1.5 max-w-md text-[11px] leading-6 text-paper/55">
              محتوای سایت، محصولات و درخواست‌های مشتریان را از همین‌جا مدیریت کنید. داده‌ها در مرورگر شما
              ذخیره می‌شوند و پس از بارگذاری مجدد باقی می‌مانند.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button to="/" variant="light" size="sm" icon="arrowUpLeft">مشاهدهٔ سایت</Button>
            <Button onClick={() => downloadCatalog()} size="sm" icon="download">کاتالوگ</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button key={card.label} type="button" onClick={() => onNavigate(card.tab)} className="group rounded-xl border border-espresso/10 bg-[#fffdf8] p-4 text-right transition hover:border-copper/40 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-copper/10 text-copper-deep"><Icon name={card.icon} className="h-4 w-4" /></span>
              <Icon name="arrowUpLeft" className="h-3.5 w-3.5 text-mocha/30 transition group-hover:text-copper" />
            </div>
            <span className="mt-3 block text-[22px] font-extrabold leading-none text-ink">{card.value}</span>
            <span className="mt-1.5 block text-[11px] font-semibold text-coffee">{card.label}</span>
            <span className="mt-0.5 block text-[9px] text-mocha/55">{card.note}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-xl border border-espresso/10 bg-[#fffdf8]">
          <div className="flex items-center justify-between border-b border-espresso/[0.08] px-4 py-3">
            <h2 className="text-[12px] font-extrabold text-ink">آخرین درخواست‌ها</h2>
            <button type="button" onClick={() => onNavigate("inquiries")} className="flex items-center gap-1 text-[10px] font-semibold text-copper-deep hover:underline">همه <Icon name="arrowLeft" className="h-3 w-3" /></button>
          </div>
          <div className="divide-y divide-espresso/[0.06]">
            {inquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-ink">{inq.name}</span>
                    <span className="text-[9px] text-mocha/50">{inq.company}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[9.5px] text-mocha/60">{inq.product}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded border px-1.5 py-0.5 text-[8.5px]", STATUS[inq.status].cls)}>{STATUS[inq.status].label}</span>
                  <span className="num text-[8.5px] text-mocha/45">{faDate(inq.createdAt)}</span>
                </div>
              </div>
            ))}
            {inquiries.length === 0 && <p className="px-4 py-8 text-center text-[11px] text-mocha/60">هنوز درخواستی ثبت نشده است.</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-espresso/10 bg-[#fffdf8] p-4">
            <h2 className="text-[12px] font-extrabold text-ink">اقدام سریع</h2>
            <div className="mt-3 space-y-2">
              <button type="button" onClick={() => onNavigate("products")} className="flex w-full items-center gap-2.5 rounded-md border border-espresso/10 bg-paper px-3 py-2.5 text-[10.5px] font-semibold text-coffee transition hover:border-copper/40">
                <Icon name="plus" className="h-3.5 w-3.5 text-copper" /> افزودن محصول جدید
              </button>
              <button type="button" onClick={() => onNavigate("articles")} className="flex w-full items-center gap-2.5 rounded-md border border-espresso/10 bg-paper px-3 py-2.5 text-[10.5px] font-semibold text-coffee transition hover:border-copper/40">
                <Icon name="edit" className="h-3.5 w-3.5 text-copper" /> نوشتن مقالهٔ تازه
              </button>
              <button type="button" onClick={() => onNavigate("inquiries")} className="flex w-full items-center gap-2.5 rounded-md border border-espresso/10 bg-paper px-3 py-2.5 text-[10.5px] font-semibold text-coffee transition hover:border-copper/40">
                <Icon name="message" className="h-3.5 w-3.5 text-copper" /> بررسی درخواست‌ها ({newCount})
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-espresso/10 bg-paper-2 p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-ink"><Icon name="chart" className="h-3.5 w-3.5 text-copper" /> وضعیت درخواست‌ها</div>
            <div className="mt-3 space-y-2">
              {(Object.keys(STATUS) as Inquiry["status"][]).map((status) => {
                const count = inquiries.filter((i) => i.status === status).length;
                const pct = inquiries.length ? Math.round((count / inquiries.length) * 100) : 0;
                return (
                  <div key={status} className="flex items-center gap-2">
                    <span className="w-20 text-[9px] text-mocha/70">{STATUS[status].label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-espresso/[0.07]">
                      <div className={cn("h-full rounded-full", STATUS[status].dot)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="num w-4 text-left text-[9px] font-semibold text-coffee">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-espresso/10 bg-[#fffdf8] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-extrabold text-ink">آخرین محصولات</h2>
          <button type="button" onClick={() => onNavigate("products")} className="text-[10px] font-semibold text-copper-deep hover:underline">مدیریت محصولات</button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-2.5 rounded-md border border-espresso/[0.08] p-2">
              <img src={p.image} alt="" className="h-10 w-12 rounded object-cover" loading="lazy" />
              <div className="min-w-0">
                <span className="block truncate text-[10px] font-bold text-ink">{p.name}</span>
                <span className="mt-0.5 block text-[8.5px] text-mocha/55">{p.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- products admin ----------------------- */
function ProductsAdmin() {
  const { products, saveProduct, deleteProduct, downloadCatalog } = useStore();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) => `${p.name} ${p.latin} ${p.capacity}`.toLowerCase().includes(search.toLowerCase()));
  const target = products.find((p) => p.id === confirmId);

  return (
    <div className="space-y-4">
      <AdminHead
        title="مدیریت محصولات"
        description="افزودن، ویرایش و حذف تجهیزات؛ تغییرات بلافاصله در صفحهٔ محصولات سایت اعمال می‌شود."
        action={<Button size="sm" icon="plus" onClick={() => setEditing("new")}>افزودن محصول</Button>}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-espresso/10 bg-[#fffdf8] p-3">
        <div className="relative w-full sm:max-w-xs">
          <Icon name="search" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mocha/50" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجوی محصول…" aria-label="جستجوی محصول" className="field py-2 pr-8 text-[12px]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-mocha/60"><span className="num font-semibold text-coffee">{filtered.length}</span> محصول</span>
          <Button size="sm" variant="outline" icon="download" onClick={() => downloadCatalog()}>کاتالوگ</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-espresso/10 bg-[#fffdf8]">
        <div className="hidden grid-cols-[2.4fr_1fr_1fr_0.7fr_1.1fr] gap-3 border-b border-espresso/10 bg-paper-2 px-4 py-2.5 text-[9px] font-semibold text-mocha/70 md:grid">
          <span>محصول</span><span>دسته‌بندی</span><span>ظرفیت</span><span>منتخب</span><span>عملیات</span>
        </div>
        <div className="divide-y divide-espresso/[0.06]">
          {filtered.map((p) => (
            <div key={p.id} className="grid gap-2 px-4 py-3 transition hover:bg-paper-2/50 md:grid-cols-[2.4fr_1fr_1fr_0.7fr_1.1fr] md:items-center md:gap-3">
              <div className="flex items-center gap-2.5">
                <img src={p.image} alt="" className="h-10 w-12 shrink-0 rounded object-cover" loading="lazy" />
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-bold text-ink">{p.name}</span>
                  <span className="mt-0.5 block truncate font-mono text-[8px] tracking-wider text-mocha/50">{p.latin}</span>
                </div>
              </div>
              <span className="text-[10px] text-coffee/75">{CATEGORIES.find((c) => c.id === p.category)?.title}</span>
              <span className="text-[10px] text-mocha/70">{p.capacity}</span>
              <span>
                {p.featured ? <Badge tone="olive">منتخب</Badge> : <span className="text-[9px] text-mocha/40">—</span>}
              </span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setEditing(p)} className="flex items-center gap-1 rounded border border-espresso/12 px-2 py-1.5 text-[9.5px] text-coffee transition hover:border-copper hover:text-copper-deep"><Icon name="edit" className="h-3 w-3" /> ویرایش</button>
                <button type="button" onClick={() => downloadCatalog(p)} aria-label="دانلود برگهٔ فنی" className="grid h-7 w-7 place-items-center rounded border border-espresso/12 text-coffee transition hover:border-copper"><Icon name="download" className="h-3 w-3" /></button>
                <button type="button" onClick={() => setConfirmId(p.id)} aria-label="حذف محصول" className="grid h-7 w-7 place-items-center rounded border border-espresso/12 text-mocha transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"><Icon name="trash" className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="px-4 py-12 text-center text-[11px] text-mocha/60">محصولی مطابق جستجو پیدا نشد.</div>}
        </div>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "افزودن محصول جدید" : "ویرایش محصول"} subtitle="تغییرات در مرورگر شما ذخیره می‌شود." wide>
        {editing !== null && (
          <ProductForm
            initial={editing === "new" ? emptyProduct() : editing}
            existingSlugs={products.filter((p) => (editing === "new" ? true : p.id !== editing.id)).map((p) => p.slug)}
            onCancel={() => setEditing(null)}
            onSave={(product) => {
              saveProduct(product);
              setEditing(null);
            }}
          />
        )}
      </Modal>

      <Modal open={!!target} onClose={() => setConfirmId(null)} title="حذف محصول" subtitle="این عملیات قابل بازگشت نیست.">
        <p className="text-[12px] leading-7 text-mocha/85">آیا از حذف <strong className="text-ink">«{target?.name}»</strong> مطمئن هستید؟ صفحهٔ این محصول از سایت حذف خواهد شد.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmId(null)}>انصراف</Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => { if (target) deleteProduct(target.id); setConfirmId(null); }}>حذف محصول</Button>
        </div>
      </Modal>
    </div>
  );
}

function ProductForm({
  initial,
  existingSlugs,
  onSave,
  onCancel,
}: {
  initial: Product;
  existingSlugs: string[];
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const { notify } = useStore();
  const [form, setForm] = useState<Product>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [specsText, setSpecsText] = useState(specText(initial.specs));
  const [highlightsText, setHighlightsText] = useState(initial.highlights.join("\n"));
  const [appsText, setAppsText] = useState(initial.applications.join("\n"));
  const [galleryText, setGalleryText] = useState(initial.gallery.join("\n"));

  const set = <K extends keyof Product>(key: K, value: Product[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "نام محصول الزامی است.";
    if (!form.slug.trim()) next.slug = "نامک (slug) الزامی است.";
    if (existingSlugs.includes(form.slug.trim())) next.slug = "این نامک قبلاً استفاده شده است.";
    if (form.description.trim().length < 15) next.description = "توضیح محصول حداقل ۱۵ نویسه باشد.";
    if (!form.tagline.trim()) next.tagline = "یک شعار کوتاه بنویسید.";
    setErrors(next);
    if (Object.keys(next).length) {
      notify("لطفاً خطاهای فرم را برطرف کنید.", "error");
      return;
    }
    const gallery = lines(galleryText);
    onSave({
      ...form,
      id: form.id || `p-${Date.now()}`,
      name: form.name.trim(),
      slug: form.slug.trim() || `product-${Date.now()}`,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      capacity: form.capacity.trim() || "قابل سفارشی‌سازی",
      power: form.power.trim() || "استعلام شود",
      image: form.image.trim() || IMG.roaster,
      gallery: gallery.length ? Array.from(new Set([form.image.trim() || IMG.roaster, ...gallery])) : [form.image.trim() || IMG.roaster],
      specs: parseSpecs(specsText),
      highlights: lines(highlightsText),
      applications: lines(appsText),
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 rounded-md border border-copper/25 bg-copper/[0.06] p-3 text-[10px] leading-5 text-coffee/80">
        نام و نامک باید یکتا باشند. برای مشخصات فنی، هر خط را به شکل <span className="font-mono text-[9px]">برچسب | مقدار</span> بنویسید.
      </div>
      <div>
        <label className="label" htmlFor="p-name">نام محصول <span className="text-copper">*</span></label>
        <input id="p-name" className={cn("field", errors.name && "border-red-400")} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="رستور صنعتی آر-۸۰" />
        {errors.name && <p className="mt-1 text-[10px] text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="label" htmlFor="p-slug">نامک / slug <span className="text-copper">*</span> <span className="text-[8.5px] font-normal text-mocha/50">— انگلیسی و یکتا</span></label>
        <input id="p-slug" dir="ltr" className={cn("field text-left", errors.slug && "border-red-400")} value={form.slug} onChange={(e) => set("slug", e.target.value.replace(/\s+/g, "-").toLowerCase())} placeholder="arka-r80" />
        {errors.slug && <p className="mt-1 text-[10px] text-red-600">{errors.slug}</p>}
      </div>
      <div>
        <label className="label" htmlFor="p-latin">نام لاتین / کد</label>
        <input id="p-latin" dir="ltr" className="field text-left" value={form.latin} onChange={(e) => set("latin", e.target.value)} placeholder="ARKA R-80 / DRUM ROASTER" />
      </div>
      <div>
        <label className="label" htmlFor="p-cat">دسته‌بندی</label>
        <select id="p-cat" className="field" value={form.category} onChange={(e) => set("category", e.target.value as CategoryId)}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-tagline">شعار کوتاه <span className="text-copper">*</span></label>
        <input id="p-tagline" className={cn("field", errors.tagline && "border-red-400")} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="پروفایل رست پایدار برای تولید صنعتی" />
        {errors.tagline && <p className="mt-1 text-[10px] text-red-600">{errors.tagline}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-desc">توضیح محصول <span className="text-copper">*</span></label>
        <textarea id="p-desc" rows={3} className={cn("field resize-y", errors.description && "border-red-400")} value={form.description} onChange={(e) => set("description", e.target.value)} />
        {errors.description && <p className="mt-1 text-[10px] text-red-600">{errors.description}</p>}
      </div>
      <div>
        <label className="label" htmlFor="p-capacity">ظرفیت</label>
        <input id="p-capacity" className="field" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="۸۰ کیلوگرم / بچ" />
      </div>
      <div>
        <label className="label" htmlFor="p-power">توان</label>
        <input id="p-power" className="field" value={form.power} onChange={(e) => set("power", e.target.value)} placeholder="۴ کیلووات" />
      </div>
      <div>
        <label className="label" htmlFor="p-badge">برچسب ویژه</label>
        <input id="p-badge" className="field" value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="پرفروش‌ترین" />
      </div>
      <div className="flex items-end pb-1">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-espresso/12 bg-paper px-3 py-2.5 text-[11px] text-coffee">
          <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-3.5 w-3.5 accent-[#a46933]" />
          نمایش در محصولات منتخب صفحه اصلی
        </label>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-image">آدرس تصویر اصلی</label>
        <input id="p-image" dir="ltr" className="field text-left" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="/images/roaster.jpg" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-gallery">گالری تصاویر (هر خط یک آدرس)</label>
        <textarea id="p-gallery" dir="ltr" rows={2} className="field resize-y text-left" value={galleryText} onChange={(e) => setGalleryText(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="p-specs">مشخصات فنی (برچسب | مقدار)</label>
        <textarea id="p-specs" rows={5} className="field resize-y font-mono text-[10.5px]" value={specsText} onChange={(e) => setSpecsText(e.target.value)} placeholder={"ظرفیت | ۶۰ کیلوگرم\nولتاژ | ۳۸۰ ولت"} />
      </div>
      <div>
        <label className="label" htmlFor="p-high">قابلیت‌ها (هر خط یک مورد)</label>
        <textarea id="p-high" rows={5} className="field resize-y" value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder={"کنترل PLC\nخنک‌کنندهٔ همزن‌دار"} />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="p-apps">کاربردها (هر خط یک مورد)</label>
        <textarea id="p-apps" rows={2} className="field resize-y" value={appsText} onChange={(e) => setAppsText(e.target.value)} placeholder={"رستوری تجاری\nکارخانهٔ تولید قهوه"} />
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-espresso/10 pt-4 sm:col-span-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>انصراف</Button>
        <Button type="submit" size="sm" icon="check">ذخیرهٔ محصول</Button>
      </div>
    </form>
  );
}

/* --------------------------- articles admin ---------------------- */
function ArticlesAdmin() {
  const { articles, saveArticle, deleteArticle } = useStore();
  const [editing, setEditing] = useState<Article | "new" | null>(null);
  const [confirm, setConfirm] = useState<Article | null>(null);

  return (
    <div className="space-y-4">
      <AdminHead
        title="مدیریت مقالات"
        description="نوشتن و ویرایش مطالب تخصصی وب‌سایت؛ مقالهٔ جدید بلافاصله در آرشیو نمایش داده می‌شود."
        action={<Button size="sm" icon="plus" onClick={() => setEditing("new")}>مقالهٔ جدید</Button>}
      />
      <div className="overflow-hidden rounded-lg border border-espresso/10 bg-[#fffdf8]">
        <div className="hidden grid-cols-[2.6fr_1fr_1fr_1.1fr] gap-3 border-b border-espresso/10 bg-paper-2 px-4 py-2.5 text-[9px] font-semibold text-mocha/70 md:grid">
          <span>عنوان</span><span>دسته</span><span>تاریخ</span><span>عملیات</span>
        </div>
        <div className="divide-y divide-espresso/[0.06]">
          {articles.map((a) => (
            <div key={a.id} className="grid gap-2 px-4 py-3 transition hover:bg-paper-2/50 md:grid-cols-[2.6fr_1fr_1fr_1.1fr] md:items-center">
              <div className="flex items-center gap-2.5">
                <img src={a.image} alt="" className="h-10 w-12 shrink-0 rounded object-cover" loading="lazy" />
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-bold text-ink">{a.title}</span>
                  <span className="mt-0.5 block text-[8.5px] text-mocha/50">{a.readTime} · {a.author}</span>
                </div>
              </div>
              <span className="text-[10px] text-coffee/75">{a.category}</span>
              <span className="num text-[9.5px] text-mocha/60">{a.date}</span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setEditing(a)} className="flex items-center gap-1 rounded border border-espresso/12 px-2 py-1.5 text-[9.5px] text-coffee transition hover:border-copper"><Icon name="edit" className="h-3 w-3" /> ویرایش</button>
                <button type="button" onClick={() => setConfirm(a)} aria-label="حذف مقاله" className="grid h-7 w-7 place-items-center rounded border border-espresso/12 text-mocha transition hover:border-red-300 hover:text-red-600"><Icon name="trash" className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "نوشتن مقالهٔ جدید" : "ویرایش مقاله"} subtitle="محتوا را با Markdown ساده بنویسید." wide>
        {editing !== null && (
          <ArticleForm
            initial={editing === "new" ? emptyArticle() : editing}
            existingSlugs={articles.filter((a) => (editing === "new" ? true : a.id !== editing.id)).map((a) => a.slug)}
            onCancel={() => setEditing(null)}
            onSave={(article) => { saveArticle(article); setEditing(null); }}
          />
        )}
      </Modal>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="حذف مقاله" subtitle="این عملیات قابل بازگشت نیست.">
        <p className="text-[12px] leading-7 text-mocha/85"> مقالهٔ <strong className="text-ink">«{confirm?.title}»</strong> حذف شود؟</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirm(null)}>انصراف</Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => { if (confirm) deleteArticle(confirm.id); setConfirm(null); }}>حذف مقاله</Button>
        </div>
      </Modal>
    </div>
  );
}

function ArticleForm({
  initial,
  existingSlugs,
  onSave,
  onCancel,
}: {
  initial: Article;
  existingSlugs: string[];
  onSave: (a: Article) => void;
  onCancel: () => void;
}) {
  const { notify } = useStore();
  const [form, setForm] = useState<Article>(initial);
  const [contentText, setContentText] = useState(serializeContent(initial.content));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.title.trim().length < 5) next.title = "عنوان مقاله الزامی است.";
    if (!form.slug.trim()) next.slug = "نامک الزامی است.";
    if (existingSlugs.includes(form.slug.trim())) next.slug = "این نامک قبلاً استفاده شده است.";
    if (form.excerpt.trim().length < 15) next.excerpt = "خلاصه حداقل ۱۵ نویسه باشد.";
    setErrors(next);
    if (Object.keys(next).length) { notify("لطفاً خطاهای فرم را برطرف کنید.", "error"); return; }
    const content = parseContent(contentText);
    onSave({
      ...form,
      id: form.id || `a-${Date.now()}`,
      title: form.title.trim(),
      slug: form.slug.trim() || `article-${Date.now()}`,
      excerpt: form.excerpt.trim(),
      content: content.length ? content : [{ type: "p", text: form.excerpt.trim() }],
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="label" htmlFor="a-title">عنوان مقاله <span className="text-copper">*</span></label>
        <input id="a-title" className={cn("field", errors.title && "border-red-400")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        {errors.title && <p className="mt-1 text-[10px] text-red-600">{errors.title}</p>}
      </div>
      <div>
        <label className="label" htmlFor="a-slug">نامک / slug <span className="text-copper">*</span></label>
        <input id="a-slug" dir="ltr" className={cn("field text-left", errors.slug && "border-red-400")} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        {errors.slug && <p className="mt-1 text-[10px] text-red-600">{errors.slug}</p>}
      </div>
      <div>
        <label className="label" htmlFor="a-cat">دسته</label>
        <select id="a-cat" className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {["فناوری رست", "انتخاب تجهیزات", "فرآیند تولید", "نگهداشت", "بسته‌بندی", "راهنمای خرید"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="a-author">نویسنده</label>
        <input id="a-author" className="field" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
      </div>
      <div>
        <label className="label" htmlFor="a-date">تاریخ انتشار</label>
        <input id="a-date" className="field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </div>
      <div>
        <label className="label" htmlFor="a-read">زمان مطالعه</label>
        <input id="a-read" className="field" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="a-excerpt">خلاصه <span className="text-copper">*</span></label>
        <textarea id="a-excerpt" rows={2} className={cn("field resize-y", errors.excerpt && "border-red-400")} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        {errors.excerpt && <p className="mt-1 text-[10px] text-red-600">{errors.excerpt}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="a-image">آدرس تصویر</label>
        <input id="a-image" dir="ltr" className="field text-left" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="a-content">متن مقاله</label>
        <textarea
          id="a-content"
          rows={10}
          className="field resize-y font-mono text-[11px] leading-6"
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          placeholder={"مقدمه‌ٔ مقاله را اینجا بنویسید.\n\n## یک تیتر بخش\n\nمتن بخش...\n\n- مورد نخست\n- مورد دوم\n\n> یک نقل‌قول الهام‌بخش"}
        />
        <div className="mt-2 flex flex-wrap gap-3 rounded-md border border-espresso/10 bg-paper px-3 py-2 text-[9px] text-mocha/65">
          <span className="font-semibold text-coffee">راهنما:</span>
          <span><code className="font-mono text-copper-deep">## </code>تیتر</span>
          <span><code className="font-mono text-copper-deep">&gt; </code>نقل‌قول</span>
          <span><code className="font-mono text-copper-deep">- </code>فهرست</span>
          <span>خط خالی = پاراگراف جدید</span>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-espresso/10 pt-4 sm:col-span-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>انصراف</Button>
        <Button type="submit" size="sm" icon="check">انتشار مقاله</Button>
      </div>
    </form>
  );
}

/* -------------------------- inquiries admin ---------------------- */
function InquiriesAdmin() {
  const { inquiries, updateInquiryStatus, deleteInquiry, notify } = useStore();
  const [filter, setFilter] = useState<"all" | Inquiry["status"]>("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const list = inquiries.filter((i) => filter === "all" || i.status === filter);

  const exportCsv = () => {
    const header = ["کد", "نام", "شرکت", "تلفن", "ایمیل", "محصول", "ظرفیت", "پیام", "منبع", "وضعیت", "تاریخ"];
    const rows = inquiries.map((i) => [i.id, i.name, i.company, i.phone, i.email, i.product, i.capacity, i.message, i.source, STATUS[i.status].label, i.createdAt]);
    const csv = "\ufeff" + [header, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ARKA-inquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
    notify("فایل CSV درخواست‌ها دانلود شد.");
  };

  return (
    <div className="space-y-4">
      <AdminHead
        title="درخواست‌های مشتریان"
        description="پیگیری درخواست‌های خرید و مشاورهٔ ثبت‌شده از فرم سایت. وضعیت هر درخواست را به‌روز کنید."
        action={<Button size="sm" variant="outline" icon="download" onClick={exportCsv}>خروجی CSV</Button>}
      />
      <div className="hide-scrollbar flex gap-2 overflow-x-auto">
        {(["all", "new", "review", "contacted", "closed"] as const).map((f) => {
          const count = f === "all" ? inquiries.length : inquiries.filter((i) => i.status === f).length;
          const label = f === "all" ? "همه" : STATUS[f].label;
          return (
            <button key={f} type="button" onClick={() => setFilter(f)} className={cn("flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-[10.5px] font-semibold transition", filter === f ? "border-espresso bg-espresso text-paper" : "border-espresso/12 bg-[#fffdf8] text-coffee/75 hover:border-copper/40")}>
              {label} <span className={cn("num rounded px-1.5 py-0.5 text-[8.5px]", filter === f ? "bg-white/15" : "bg-espresso/[0.06]")}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-espresso/10 bg-[#fffdf8]">
        <div className="hidden grid-cols-[1fr_1.5fr_0.8fr_1fr_0.9fr] gap-3 border-b border-espresso/10 bg-paper-2 px-4 py-2.5 text-[9px] font-semibold text-mocha/70 lg:grid">
          <span>مشتری</span><span>موضوع / محصول</span><span>تاریخ</span><span>وضعیت</span><span>عملیات</span>
        </div>
        <div className="divide-y divide-espresso/[0.06]">
          {list.map((inq) => (
            <div key={inq.id} className="grid gap-2 px-4 py-3 transition hover:bg-paper-2/50 lg:grid-cols-[1fr_1.5fr_0.8fr_1fr_0.9fr] lg:items-center lg:gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-ink">{inq.name}</span>
                  <span className="num text-[8px] text-copper-deep">{inq.id}</span>
                </div>
                <span className="mt-0.5 block truncate text-[9px] text-mocha/55">{inq.company} · <span dir="ltr">{inq.phone}</span></span>
              </div>
              <div className="min-w-0">
                <span className="block truncate text-[10px] text-coffee/80">{inq.product}</span>
                <span className="mt-0.5 block truncate text-[8.5px] text-mocha/45">{inq.capacity}</span>
              </div>
              <span className="num text-[9px] text-mocha/55">{faDate(inq.createdAt)}</span>
              <div className="relative w-fit">
                <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-1 text-[9px] font-semibold", STATUS[inq.status].cls)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", STATUS[inq.status].dot)} />
                  {STATUS[inq.status].label}
                </span>
                <select
                  value={inq.status}
                  onChange={(e) => { updateInquiryStatus(inq.id, e.target.value as Inquiry["status"]); notify("وضعیت درخواست به‌روز شد."); }}
                  aria-label="وضعیت درخواست"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  {(Object.keys(STATUS) as Inquiry["status"][]).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setSelected(inq)} className="flex items-center gap-1 rounded border border-espresso/12 px-2 py-1.5 text-[9.5px] text-coffee transition hover:border-copper"><Icon name="message" className="h-3 w-3" /> مشاهده</button>
                <a href={`tel:${inq.phone}`} aria-label="تماس" className="grid h-7 w-7 place-items-center rounded border border-espresso/12 text-coffee transition hover:border-copper"><Icon name="phone" className="h-3 w-3" /></a>
                <button type="button" onClick={() => { if (window.confirm("این درخواست حذف شود؟")) deleteInquiry(inq.id); }} aria-label="حذف" className="grid h-7 w-7 place-items-center rounded border border-espresso/12 text-mocha transition hover:border-red-300 hover:text-red-600"><Icon name="trash" className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="px-4 py-14 text-center">
              <Icon name="message" className="mx-auto h-7 w-7 text-copper/60" />
              <p className="mt-2 text-[11px] text-mocha/60">در این وضعیت درخواستی وجود ندارد.</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`درخواست ${selected?.id ?? ""}`} subtitle={selected?.name}>
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["نام مشتری", selected.name],
                ["کسب‌وکار", selected.company],
                ["تلفن", selected.phone],
                ["ایمیل", selected.email],
                ["موضوع", selected.product],
                ["ظرفیت", selected.capacity],
                ["منبع", selected.source],
                ["تاریخ", faDate(selected.createdAt)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-espresso/10 bg-paper px-3 py-2">
                  <span className="block text-[9px] text-mocha/55">{label}</span>
                  <span className="mt-0.5 block break-words text-[11px] font-semibold text-coffee" dir={label === "ایمیل" || label === "تلفن" ? "ltr" : undefined}>{value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-espresso/10 bg-paper p-3">
              <span className="block text-[9px] text-mocha/55">پیام مشتری</span>
              <p className="mt-1 text-[11.5px] leading-7 text-coffee/85">{selected.message}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-espresso/10 pt-3">
              <div className="flex gap-2">
                <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 rounded-md bg-espresso px-3 py-2 text-[10.5px] font-semibold text-paper"><Icon name="phone" className="h-3.5 w-3.5" /> تماس</a>
                <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 rounded-md border border-espresso/15 px-3 py-2 text-[10.5px] font-semibold text-coffee"><Icon name="mail" className="h-3.5 w-3.5" /> ایمیل</a>
              </div>
              <select value={selected.status} onChange={(e) => { const s = e.target.value as Inquiry["status"]; updateInquiryStatus(selected.id, s); setSelected({ ...selected, status: s }); }} className="field w-auto py-1.5 text-[10px]" aria-label="تغییر وضعیت">
                {(Object.keys(STATUS) as Inquiry["status"][]).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* --------------------------- settings ---------------------------- */
function SettingsAdmin() {
  const { products, articles, inquiries, resetContent, downloadCatalog } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const storage = useMemo(() => {
    try {
      return Math.round((localStorage.getItem("arka.content.v1")?.length ?? 0) / 1024);
    } catch {
      return 0;
    }
  }, [products, articles, inquiries]);

  return (
    <div className="space-y-4">
      <AdminHead title="تنظیمات و اطلاعات" description="وضعیت ذخیره‌سازی محلی، خروجی محتوا و بازنشانی داده‌های نمایشی." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-espresso/10 bg-[#fffdf8] p-5">
          <h2 className="flex items-center gap-2 text-[12px] font-extrabold text-ink"><Icon name="settings" className="h-4 w-4 text-copper" /> ذخیره‌سازی محتوا</h2>
          <p className="mt-2 text-[11px] leading-6 text-mocha/75">
            این نمونهٔ نمایشی بدون پایگاه‌داده کار می‌کند؛ محصولات، مقالات و درخواست‌ها در <code className="rounded bg-paper-2 px-1 font-mono text-[10px]">localStorage</code> مرورگر ذخیره می‌شوند. برای انتقال به سرور، ساختار داده آمادهٔ اتصال به API است.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["محصولات", products.length],
              ["مقالات", articles.length],
              ["درخواست‌ها", inquiries.length],
            ].map(([label, val]) => (
              <div key={label as string} className="rounded-md border border-espresso/10 bg-paper p-3 text-center">
                <span className="num block text-lg font-semibold text-copper-deep">{val as number}</span>
                <span className="text-[9px] text-mocha/60">{label as string}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-md bg-paper-2 px-3 py-2 text-[10px] text-mocha/70">
            <span>حجم تقریبی ذخیره‌شده</span>
            <span className="num font-semibold text-coffee">{storage} KB</span>
          </div>
        </div>

        <div className="rounded-xl border border-espresso/10 bg-[#fffdf8] p-5">
          <h2 className="flex items-center gap-2 text-[12px] font-extrabold text-ink"><Icon name="download" className="h-4 w-4 text-copper" /> خروجی محتوا</h2>
          <p className="mt-2 text-[11px] leading-6 text-mocha/75">کاتالوگ محصولات را به‌صورت فایل کامل مشخصات (قابل چاپ) دانلود کنید.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" icon="download" onClick={() => downloadCatalog()}>دانلود کاتالوگ کامل (PDF)</Button>
            <Button size="sm" variant="outline" icon="file" onClick={() => downloadCatalog(undefined, "html")}>کاتالوگ HTML</Button>
            <Button to="/products" variant="outline" size="sm" icon="arrowUpLeft">مشاهدهٔ کاتالوگ سایت</Button>
          </div>
          <div className="mt-5 border-t border-espresso/10 pt-4">
            <h3 className="text-[11px] font-bold text-ink">بازنشانی داده‌های نمایشی</h3>
            <p className="mt-1 text-[10px] leading-5 text-mocha/65">همهٔ تغییرات شما حذف و محصولات و مقالات نمونه بازگردانی می‌شوند.</p>
            <Button size="sm" variant="outline" icon="alert" className="mt-2 border-red-200 text-red-700 hover:border-red-400" onClick={() => setConfirmReset(true)}>بازنشانی محتوا</Button>
          </div>
        </div>

        <div className="rounded-xl border border-espresso/10 bg-espresso p-5 text-paper lg:col-span-2">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <span className="eyebrow text-[8px] text-copper">BRAND</span>
              <h2 className="mt-1.5 text-[14px] font-extrabold">{COMPANY.name}</h2>
              <p className="mt-1 text-[10px] text-paper/50">{COMPANY.slogan} · {COMPANY.address}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[9.5px] text-paper/50">
              <span className="num rounded border border-paper/15 px-2 py-1" dir="ltr">{COMPANY.phone}</span>
              <span className="rounded border border-paper/15 px-2 py-1" dir="ltr">{COMPANY.email}</span>
            </div>
          </div>
        </div>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="بازنشانی محتوا" subtitle="تمام تغییرات ذخیره‌شده حذف می‌شود.">
        <p className="text-[12px] leading-7 text-mocha/85">آیا مطمئن هستید؟ محصولات، مقالات و درخواست‌های سفارشی شما با داده‌های نمایشی جایگزین می‌شوند.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmReset(false)}>انصراف</Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => { resetContent(); setConfirmReset(false); }}>بازنشانی</Button>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------------- helpers --------------------------- */
function AdminHead({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-[15px] font-extrabold text-ink md:text-base">{title}</h2>
        <p className="mt-1 max-w-2xl text-[10.5px] leading-6 text-mocha/65">{description}</p>
      </div>
      {action}
    </div>
  );
}
