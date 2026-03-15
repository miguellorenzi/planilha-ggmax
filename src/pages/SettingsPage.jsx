import { Panel } from '../components/ui';

export const SettingsPage = ({ settings, onChange, onExport, onImport }) => (
  <div className="space-y-6">
    <Panel title="Configurações gerais" subtitle="Personalização do painel e preferências básicas">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-300">
          Nome do painel
          <input value={settings.panelName} onChange={(e) => onChange({ ...settings, panelName: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label className="text-sm text-slate-300">
          Tema
          <select value={settings.theme} onChange={(e) => onChange({ ...settings, theme: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
            <option value="dark-premium">Dark Premium</option>
            <option value="dark-contrast">Dark Contrast</option>
          </select>
        </label>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.compactMode} onChange={(e) => onChange({ ...settings, compactMode: e.target.checked })} /> Modo compacto
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.autoExportReminder} onChange={(e) => onChange({ ...settings, autoExportReminder: e.target.checked })} /> Lembrete automático de exportação
        </label>
      </div>
    </Panel>

    <Panel title="Dados e backup" subtitle="Exportação e importação em JSON">
      <div className="flex flex-wrap gap-3">
        <button onClick={onExport} className="rounded-xl bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400">Exportar dados</button>
        <label className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 cursor-pointer">
          Importar dados
          <input type="file" accept="application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
        </label>
      </div>
    </Panel>
  </div>
);
