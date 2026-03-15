import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel } from '../components/ui';
import { formatCurrency } from '../utils/format';

export const ReportsPage = ({ kpis, monthlyData, salesByGame, topStatus }) => (
  <div className="space-y-6">
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Panel key={kpi.label}>
          <p className="text-sm text-slate-400">{kpi.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{kpi.value}</p>
          <p className="text-xs text-slate-500">{kpi.description}</p>
        </Panel>
      ))}
    </section>

    <section className="grid gap-6 xl:grid-cols-2">
      <Panel title="Desempenho mensal">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#233047" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} />
              <Line type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Vendas por jogo">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByGame}>
              <CartesianGrid strokeDasharray="3 3" stroke="#233047" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </section>

    <Panel title="Resumo executivo">
      <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-300">
        <p>Faturamento total consolidado: <span className="font-semibold text-slate-100">{formatCurrency(kpis[0].raw)}</span></p>
        <p>Lucro total consolidado: <span className="font-semibold text-slate-100">{formatCurrency(kpis[1].raw)}</span></p>
        <p>Status mais comum: <span className="font-semibold text-slate-100">{topStatus}</span></p>
      </div>
    </Panel>
  </div>
);
