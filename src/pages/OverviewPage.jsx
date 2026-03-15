import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Panel, StatusBadge } from '../components/ui';
import { formatCurrency, formatDate } from '../utils/format';

const colorPalette = ['#818cf8', '#22d3ee', '#34d399', '#f59e0b', '#f43f5e'];

export const OverviewPage = ({ summary, monthlyData, salesByGame, salesByStatus, recent }) => (
  <div className="space-y-6">
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {summary.map((item) => (
        <Panel key={item.label}>
          <p className="text-sm text-slate-400">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-50">{item.value}</p>
          <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
        </Panel>
      ))}
    </section>

    <section className="grid gap-6 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <Panel title="Faturamento e lucro mensal" subtitle="Performance consolidada dos últimos 6 meses">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#243045" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#818cf8" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" stroke="#34d399" fill="url(#profit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <div className="space-y-6 xl:col-span-4">
        <Panel title="Vendas por jogo">
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByGame}>
                <XAxis dataKey="name" stroke="#64748b" hide />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" radius={[7, 7, 0, 0]}>
                  {salesByGame.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={colorPalette[index % colorPalette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {salesByGame.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: colorPalette[idx % colorPalette.length] }} />{item.name}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Status das vendas">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesByStatus} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={4}>
                  {salesByStatus.map((entry, index) => (
                    <Cell key={`status-cell-${entry.name}`} fill={colorPalette[index % colorPalette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </section>

    <section className="grid gap-6 lg:grid-cols-3">
      <Panel title="Atividade recente">
        <ul className="space-y-3 text-sm text-slate-300">
          {recent.activity.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">{item.text}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="Últimas vendas">
        <ul className="space-y-3 text-sm text-slate-300">
          {recent.sales.map((sale) => (
            <li key={sale.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <p className="font-medium text-slate-100">{sale.id} • {sale.game}</p>
              <p className="text-xs text-slate-400">{formatDate(sale.date)} • {formatCurrency(sale.price)}</p>
              <div className="mt-2"><StatusBadge status={sale.status} /></div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Mediações e produtos novos">
        <div className="space-y-4 text-sm text-slate-300">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Mediações</p>
            {recent.mediations.map((med) => (
              <div key={med.id} className="mb-2 rounded-xl border border-slate-800 bg-slate-900 p-3">
                <p className="font-medium text-slate-100">{med.id} • {med.buyer}</p>
                <StatusBadge status={med.status} />
              </div>
            ))}
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Produtos recentes</p>
            {recent.inventory.map((item) => (
              <div key={item.id} className="mb-2 rounded-xl border border-slate-800 bg-slate-900 p-3">
                <p className="font-medium text-slate-100">{item.name}</p>
                <p className="text-xs text-slate-400">{item.game}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  </div>
);
