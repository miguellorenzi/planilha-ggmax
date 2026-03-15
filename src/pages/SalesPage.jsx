import { useMemo, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Panel, StatusBadge } from '../components/ui';
import { formatCurrency, formatDate, getProfitFromSale } from '../utils/format';

const PAGE_SIZE = 6;

export const SalesPage = ({ sales, onEdit, onDelete, globalSearch }) => {
  const [query, setQuery] = useState('');
  const [gameFilter, setGameFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortKey, setSortKey] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);

  const games = ['Todos', ...new Set(sales.map((sale) => sale.game))];
  const statuses = ['Todos', ...new Set(sales.map((sale) => sale.status))];

  const filteredSales = useMemo(() => {
    const search = `${query} ${globalSearch}`.trim().toLowerCase();
    const list = sales.filter((sale) => {
      const text = `${sale.id} ${sale.game} ${sale.buyer} ${sale.productType} ${sale.notes}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesGame = gameFilter === 'Todos' || sale.game === gameFilter;
      const matchesStatus = statusFilter === 'Todos' || sale.status === statusFilter;
      return matchesSearch && matchesGame && matchesStatus;
    });

    return list.sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      if (sortKey === 'date') return (new Date(a.date) - new Date(b.date)) * dir;
      return (String(a[sortKey]).localeCompare(String(b[sortKey]), 'pt-BR', { numeric: true })) * dir;
    });
  }, [sales, query, globalSearch, gameFilter, statusFilter, sortKey, sortDirection]);

  const paginatedSales = filteredSales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / PAGE_SIZE));

  const toggleSort = (field) => {
    if (sortKey === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(field);
    setSortDirection('asc');
  };

  return (
    <Panel title="Gestão completa de vendas" subtitle="Busca, filtros avançados, paginação e ações rápidas">
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Buscar por ID, comprador ou observação" className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-400" />
        <select value={gameFilter} onChange={(e) => { setGameFilter(e.target.value); setPage(1); }} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
          {games.map((game) => <option key={game}>{game}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <p className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-400">{filteredSales.length} venda(s) encontrada(s)</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              {[
                ['id', 'ID'], ['game', 'Jogo'], ['productType', 'Produto'], ['buyer', 'Comprador'], ['price', 'Preço'], ['fee', 'Taxa'], ['cost', 'Custo'], ['profit', 'Lucro'], ['status', 'Status'], ['date', 'Data'], ['notes', 'Observações']
              ].map(([key, label]) => (
                <th key={key} className="px-3 py-3 cursor-pointer" onClick={() => toggleSort(key === 'profit' ? 'price' : key)}>{label}</th>
              ))}
              <th className="px-3 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale) => (
              <tr key={sale.id} className="border-t border-slate-800 bg-slate-950/40 text-slate-200">
                <td className="px-3 py-3 font-medium">{sale.id}</td>
                <td className="px-3 py-3">{sale.game}</td>
                <td className="px-3 py-3">{sale.productType}</td>
                <td className="px-3 py-3">{sale.buyer}</td>
                <td className="px-3 py-3">{formatCurrency(sale.price)}</td>
                <td className="px-3 py-3">{formatCurrency(sale.fee)}</td>
                <td className="px-3 py-3">{formatCurrency(sale.cost)}</td>
                <td className="px-3 py-3 text-emerald-300">{formatCurrency(getProfitFromSale(sale))}</td>
                <td className="px-3 py-3"><StatusBadge status={sale.status} /></td>
                <td className="px-3 py-3">{formatDate(sale.date)}</td>
                <td className="px-3 py-3 text-slate-400">{sale.notes}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-slate-700 p-1.5 hover:border-slate-500"><Eye size={14} /></button>
                    <button onClick={() => onEdit(sale)} className="rounded-lg border border-slate-700 p-1.5 hover:border-indigo-400"><Pencil size={14} /></button>
                    <button onClick={() => onDelete(sale.id)} className="rounded-lg border border-slate-700 p-1.5 hover:border-rose-400"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <p>Página {page} de {totalPages}</p>
        <div className="space-x-2">
          <button disabled={page === 1} onClick={() => setPage((v) => v - 1)} className="rounded-lg border border-slate-700 px-3 py-1 disabled:opacity-50">Anterior</button>
          <button disabled={page === totalPages} onClick={() => setPage((v) => v + 1)} className="rounded-lg border border-slate-700 px-3 py-1 disabled:opacity-50">Próxima</button>
        </div>
      </div>
    </Panel>
  );
};
