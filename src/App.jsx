import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Boxes, FileText, Gavel, LayoutDashboard, Settings } from 'lucide-react';
import { defaultSettings, mockInventory, mockMediations, mockSales, monthlyPerformance } from './data/mockData';
import { ContentWrapper, PageShell, Sidebar, Topbar } from './components/ui';
import { OverviewPage } from './pages/OverviewPage';
import { SalesPage } from './pages/SalesPage';
import { InventoryPage } from './pages/InventoryPage';
import { MediationsPage } from './pages/MediationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Input, Modal, Select } from './components/forms';
import { formatCurrency, getProfitFromSale } from './utils/format';

const STORAGE_KEY = 'ggmax-dashboard-v1';

const navItems = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'sales', label: 'Vendas', icon: FileText },
  { id: 'inventory', label: 'Estoque', icon: Boxes },
  { id: 'mediations', label: 'Mediações', icon: Gavel },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

const initialSaleForm = {
  id: '', game: 'Valorant', productType: '', buyer: '', price: 0, fee: 0, cost: 0, status: 'Aguardando', date: new Date().toISOString().slice(0, 10), notes: '',
};
const initialItemForm = { id: '', name: '', game: 'Valorant', type: '', expectedPrice: 0, cost: 0, status: 'Disponível', notes: '' };

const hydrate = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { sales: mockSales, inventory: mockInventory, mediations: mockMediations, settings: defaultSettings };
  }
  return JSON.parse(raw);
};

function App() {
  const [page, setPage] = useState('overview');
  const [search, setSearch] = useState('');
  const [state, setState] = useState(() => hydrate());
  const [saleModal, setSaleModal] = useState({ open: false, editId: null, form: initialSaleForm });
  const [itemModal, setItemModal] = useState({ open: false, editId: null, form: initialItemForm });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const stats = useMemo(() => {
    const totalRevenue = state.sales.reduce((acc, sale) => acc + Number(sale.price), 0);
    const totalProfit = state.sales.reduce((acc, sale) => acc + getProfitFromSale(sale), 0);
    const monthSales = state.sales.filter((sale) => sale.date.startsWith('2026-02')).length;
    const openMediations = state.mediations.filter((item) => item.status !== 'Resolvida' && item.status !== 'Encerrada').length;
    const avgTicket = state.sales.length ? totalRevenue / state.sales.length : 0;

    return {
      totalRevenue,
      totalProfit,
      monthSales,
      openMediations,
      stockCount: state.inventory.length,
      avgTicket,
    };
  }, [state]);

  const salesByGame = useMemo(() => {
    const map = state.sales.reduce((acc, sale) => {
      acc[sale.game] = (acc[sale.game] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [state.sales]);

  const salesByStatus = useMemo(() => {
    const map = state.sales.reduce((acc, sale) => {
      acc[sale.status] = (acc[sale.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [state.sales]);

  const monthlyData = useMemo(() => monthlyPerformance.map((month) => ({ ...month })), []);

  const addOrUpdateSale = (event) => {
    event.preventDefault();
    const form = { ...saleModal.form, price: Number(saleModal.form.price), fee: Number(saleModal.form.fee), cost: Number(saleModal.form.cost) };

    setState((current) => {
      const exists = current.sales.some((sale) => sale.id === form.id);
      if (exists) {
        return { ...current, sales: current.sales.map((sale) => (sale.id === form.id ? form : sale)) };
      }
      return { ...current, sales: [form, ...current.sales] };
    });

    setSaleModal({ open: false, editId: null, form: initialSaleForm });
  };

  const addOrUpdateItem = (event) => {
    event.preventDefault();
    const form = { ...itemModal.form, expectedPrice: Number(itemModal.form.expectedPrice), cost: Number(itemModal.form.cost) };
    setState((current) => {
      const exists = current.inventory.some((item) => item.id === form.id);
      if (exists) {
        return { ...current, inventory: current.inventory.map((item) => (item.id === form.id ? form : item)) };
      }
      return { ...current, inventory: [form, ...current.inventory] };
    });
    setItemModal({ open: false, editId: null, form: initialItemForm });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ggmax-dashboard-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    setState(parsed);
  };

  const createMediationFromSale = (saleId) => {
    const sale = state.sales.find((item) => item.id === saleId);
    if (!sale) return;
    const entry = {
      id: `MED-${Math.floor(Math.random() * 900 + 100)}`,
      saleId: sale.id,
      buyer: sale.buyer,
      openDate: new Date().toISOString().slice(0, 10),
      status: 'Aberta',
      priority: 'Média',
      notes: `Mediação criada automaticamente para ${sale.id}.`,
    };
    setState((current) => ({ ...current, mediations: [entry, ...current.mediations] }));
  };

  const pageTitle = navItems.find((item) => item.id === page)?.label || 'Dashboard';

  return (
    <PageShell>
      <Sidebar items={navItems} currentPage={page} onNavigate={setPage} panelName={state.settings.panelName} />
      <ContentWrapper>
        <Topbar
          title={pageTitle}
          search={search}
          onSearchChange={setSearch}
          onAddSale={() => setSaleModal({ open: true, editId: null, form: { ...initialSaleForm, id: `GG-${Math.floor(Math.random() * 9000 + 1000)}` } })}
          onExport={exportData}
        />

        {page === 'overview' && (
          <OverviewPage
            summary={[
              { label: 'Total vendido', value: formatCurrency(stats.totalRevenue), hint: 'Receita bruta acumulada' },
              { label: 'Lucro líquido', value: formatCurrency(stats.totalProfit), hint: 'Já descontando taxa e custo' },
              { label: 'Vendas do mês', value: `${stats.monthSales}`, hint: 'Referência: fevereiro' },
              { label: 'Mediações abertas', value: `${stats.openMediations}`, hint: 'Exigem atenção operacional' },
              { label: 'Produtos em estoque', value: `${stats.stockCount}`, hint: 'Contas e ativos disponíveis' },
              { label: 'Ticket médio', value: formatCurrency(stats.avgTicket), hint: 'Valor médio por pedido' },
            ]}
            monthlyData={monthlyData}
            salesByGame={salesByGame}
            salesByStatus={salesByStatus}
            recent={{
              activity: [
                { id: 1, text: 'Nova venda GG-9301 criada por Equipe GGMAX.' },
                { id: 2, text: 'Estoque INV-403 atualizado com nova observação.' },
                { id: 3, text: 'Mediação MED-110 recebeu atualização de prioridade.' },
              ],
              sales: state.sales.slice(0, 3),
              mediations: state.mediations.slice(0, 2),
              inventory: state.inventory.slice(0, 2),
            }}
          />
        )}

        {page === 'sales' && (
          <SalesPage
            sales={state.sales}
            globalSearch={search}
            onEdit={(sale) => setSaleModal({ open: true, editId: sale.id, form: sale })}
            onDelete={(id) => setState((current) => ({ ...current, sales: current.sales.filter((sale) => sale.id !== id) }))}
          />
        )}

        {page === 'inventory' && (
          <InventoryPage
            inventory={state.inventory}
            onAdd={() => setItemModal({ open: true, editId: null, form: { ...initialItemForm, id: `INV-${Math.floor(Math.random() * 900 + 100)}` } })}
            onEdit={(item) => setItemModal({ open: true, editId: item.id, form: item })}
            onMarkSold={(id) => {
              const item = state.inventory.find((entry) => entry.id === id);
              if (!item) return;
              const sale = {
                id: `GG-${Math.floor(Math.random() * 9000 + 1000)}`,
                game: item.game,
                productType: item.type,
                buyer: 'Comprador Estoque',
                price: item.expectedPrice,
                fee: Number((item.expectedPrice * 0.07).toFixed(2)),
                cost: item.cost,
                status: 'Concluída',
                date: new Date().toISOString().slice(0, 10),
                notes: `Venda gerada automaticamente a partir de ${item.id}.`,
              };
              setState((current) => ({
                ...current,
                inventory: current.inventory.filter((entry) => entry.id !== id),
                sales: [sale, ...current.sales],
              }));
            }}
          />
        )}

        {page === 'mediations' && (
          <MediationsPage
            mediations={state.mediations}
            onUpdateStatus={(id) => setState((current) => ({
              ...current,
              mediations: current.mediations.map((med) => (med.id === id ? { ...med, status: med.status === 'Aberta' ? 'Em análise' : 'Resolvida' } : med)),
            }))}
            onClose={(id) => setState((current) => ({
              ...current,
              mediations: current.mediations.map((med) => (med.id === id ? { ...med, status: 'Encerrada' } : med)),
            }))}
          />
        )}

        {page === 'reports' && (
          <ReportsPage
            kpis={[
              { label: 'Faturamento total', value: formatCurrency(stats.totalRevenue), raw: stats.totalRevenue, description: 'Soma de todas as vendas' },
              { label: 'Lucro total', value: formatCurrency(stats.totalProfit), raw: stats.totalProfit, description: 'Margem consolidada' },
              { label: 'Vendas por período', value: `${state.sales.length} pedidos`, raw: state.sales.length, description: 'Volume total registrado' },
              { label: 'Status mais comum', value: salesByStatus[0]?.name || '-', raw: 0, description: 'Comportamento operacional' },
            ]}
            monthlyData={monthlyData}
            salesByGame={salesByGame}
            topStatus={[...salesByStatus].sort((a, b) => b.value - a.value)[0]?.name || '-'}
          />
        )}

        {page === 'settings' && (
          <SettingsPage
            settings={state.settings}
            onChange={(newSettings) => setState((current) => ({ ...current, settings: newSettings }))}
            onExport={exportData}
            onImport={importData}
          />
        )}
      </ContentWrapper>

      <Modal open={saleModal.open} onClose={() => setSaleModal({ open: false, editId: null, form: initialSaleForm })} title={saleModal.editId ? 'Editar venda' : 'Nova venda'}>
        <form onSubmit={addOrUpdateSale} className="grid gap-3 md:grid-cols-2">
          <Input label="ID da venda" value={saleModal.form.id} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, id: e.target.value } }))} required />
          <Select label="Jogo" value={saleModal.form.game} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, game: e.target.value } }))} options={['Valorant', 'Fortnite', 'Roblox', 'Minecraft', 'Site Profissional']} />
          <Input label="Tipo do produto" value={saleModal.form.productType} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, productType: e.target.value } }))} required />
          <Input label="Comprador" value={saleModal.form.buyer} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, buyer: e.target.value } }))} required />
          <Input label="Preço" type="number" value={saleModal.form.price} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, price: e.target.value } }))} required />
          <Input label="Taxa" type="number" value={saleModal.form.fee} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, fee: e.target.value } }))} required />
          <Input label="Custo" type="number" value={saleModal.form.cost} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, cost: e.target.value } }))} required />
          <Select label="Status" value={saleModal.form.status} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, status: e.target.value } }))} options={['Aguardando', 'Concluída', 'Em mediação', 'Cancelada']} />
          <Input label="Data" type="date" value={saleModal.form.date} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, date: e.target.value } }))} required />
          <Input label="Observações" value={saleModal.form.notes} onChange={(e) => setSaleModal((current) => ({ ...current, form: { ...current.form, notes: e.target.value } }))} />
          <div className="md:col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => createMediationFromSale(saleModal.form.id)} className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">Cadastrar mediação</button>
            <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white">Salvar venda</button>
          </div>
        </form>
      </Modal>

      <Modal open={itemModal.open} onClose={() => setItemModal({ open: false, editId: null, form: initialItemForm })} title={itemModal.editId ? 'Editar item de estoque' : 'Novo item de estoque'}>
        <form onSubmit={addOrUpdateItem} className="grid gap-3 md:grid-cols-2">
          <Input label="ID" value={itemModal.form.id} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, id: e.target.value } }))} required />
          <Input label="Nome/produto" value={itemModal.form.name} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, name: e.target.value } }))} required />
          <Select label="Jogo" value={itemModal.form.game} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, game: e.target.value } }))} options={['Valorant', 'Fortnite', 'Roblox', 'Minecraft', 'Site Profissional']} />
          <Input label="Tipo" value={itemModal.form.type} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, type: e.target.value } }))} required />
          <Input label="Preço esperado" type="number" value={itemModal.form.expectedPrice} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, expectedPrice: e.target.value } }))} required />
          <Input label="Custo" type="number" value={itemModal.form.cost} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, cost: e.target.value } }))} required />
          <Select label="Status" value={itemModal.form.status} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, status: e.target.value } }))} options={['Disponível', 'Reservado']} />
          <Input label="Observações" value={itemModal.form.notes} onChange={(e) => setItemModal((current) => ({ ...current, form: { ...current.form, notes: e.target.value } }))} />
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white">Salvar item</button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}

export default App;
