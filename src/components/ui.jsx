import { Search, Plus, Download, Bell } from 'lucide-react';

export const PageShell = ({ children }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>
);

export const Sidebar = ({ items, currentPage, onNavigate, panelName }) => (
  <aside className="fixed inset-y-0 left-0 w-72 border-r border-slate-800/80 bg-slate-950/90 px-5 py-6 backdrop-blur-xl">
    <div className="mb-10">
      <p className="text-xs uppercase tracking-[0.25em] text-indigo-300">GGMAX</p>
      <h1 className="mt-2 text-lg font-semibold text-slate-50">{panelName}</h1>
    </div>

    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const active = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
              active
                ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/50'
                : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <Icon size={18} />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  </aside>
);

export const Topbar = ({ title, search, onSearchChange, onAddSale, onExport }) => (
  <header className="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/80 px-8 py-4 backdrop-blur-xl">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">{title}</h2>
        <p className="text-sm text-slate-400">Gestão premium de vendas e operações GGMAX</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-400 lg:flex">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar em todo painel"
            className="w-56 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </label>
        <button
          onClick={onAddSale}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-soft hover:bg-indigo-400"
        >
          <Plus size={16} /> Nova venda
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
        >
          <Download size={16} /> Exportar
        </button>
        <button className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300"><Bell size={16} /></button>
        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
          <div className="hidden text-sm leading-tight md:block">
            <p className="font-medium text-slate-100">Equipe GGMAX</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export const ContentWrapper = ({ children }) => (
  <main className="ml-72 min-h-screen">
    <div className="px-8 py-6">{children}</div>
  </main>
);

export const Panel = ({ title, subtitle, right, children }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-soft">
    {(title || right) && (
      <div className="mb-4 flex items-start justify-between">
        <div>
          {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {right}
      </div>
    )}
    {children}
  </section>
);

export const StatusBadge = ({ status }) => {
  const styles = {
    Concluída: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/40',
    Aguardando: 'bg-amber-500/15 text-amber-300 ring-amber-500/40',
    'Em mediação': 'bg-rose-500/15 text-rose-300 ring-rose-500/40',
    Cancelada: 'bg-slate-500/15 text-slate-300 ring-slate-500/40',
    Disponível: 'bg-sky-500/15 text-sky-300 ring-sky-500/40',
    Reservado: 'bg-violet-500/15 text-violet-300 ring-violet-500/40',
    Aberta: 'bg-rose-500/15 text-rose-300 ring-rose-500/40',
    'Em análise': 'bg-amber-500/15 text-amber-300 ring-amber-500/40',
    Resolvida: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/40',
    Encerrada: 'bg-slate-500/15 text-slate-300 ring-slate-500/40',
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${styles[status] || styles.Cancelada}`}>{status}</span>;
};
