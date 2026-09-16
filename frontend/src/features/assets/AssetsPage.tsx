import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronRight, Eye, Factory, LoaderCircle, PackageOpen, Pencil, Plus, RefreshCw, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { assetService } from '../../services/api';
import { assetStatuses, assetTypes, statusLabels, typeLabels, type Asset, type AssetInput } from '../../types/asset';
import { AssetForm } from './components/AssetForm';
import { AssetDetails } from './components/AssetDetails';
import { StatusBadge } from './components/StatusBadge';

type Dialog = { mode: 'create' } | { mode: 'edit' | 'view' | 'delete'; asset: Asset } | null;
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const errorMessage = (cause: unknown) => cause instanceof Error ? cause.message : 'Não foi possível concluir a operação.';

export function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [dialog, setDialog] = useState<Dialog>(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try { setAssets(await assetService.list()); }
    catch (cause) { setError(errorMessage(cause)); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    assetService.list().then(data => { if (active) setAssets(data); })
      .catch((cause: unknown) => { if (active) setError(errorMessage(cause)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return assets.filter(asset => (!type || asset.type === type) && (!status || asset.status === status) &&
      [asset.code, asset.name, asset.description, asset.manufacturer, asset.model, asset.serialNumber, typeLabels[asset.type], statusLabels[asset.status]]
        .some(value => normalize(value).includes(term)));
  }, [assets, query, type, status]);
  const hasFilters = Boolean(query || type || status);

  function open(next: Exclude<Dialog, null>) {
    setFormError('');
    setNotice('');
    setDialog(next);
  }

  function close() { if (!saving) setDialog(null); }

  async function submit(input: AssetInput) {
    setSaving(true);
    setFormError('');
    try {
      const editing = dialog?.mode === 'edit';
      const saved = editing ? await assetService.update(dialog.asset.id, input) : await assetService.create(input);
      setAssets(current => [...current.filter(asset => asset.id !== saved.id), saved].sort((a, b) => a.code.localeCompare(b.code)));
      setDialog(null);
      setNotice(editing ? 'Ativo atualizado com sucesso.' : 'Ativo cadastrado com sucesso.');
    } catch (cause) { setFormError(errorMessage(cause)); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (dialog?.mode !== 'delete') return;
    setSaving(true);
    setFormError('');
    try {
      await assetService.remove(dialog.asset.id);
      setAssets(current => current.filter(asset => asset.id !== dialog.asset.id));
      setDialog(null);
      setNotice('Ativo excluído com sucesso.');
    } catch (cause) { setFormError(errorMessage(cause)); }
    finally { setSaving(false); }
  }

  return <div className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-10">
        <a href="/" className="flex items-center gap-3" aria-label="Industrix — Ativos Industriais">
          <span className="flex size-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950"><Factory size={23}/></span>
          <span><span className="block text-lg font-extrabold tracking-[.12em]">INDUSTRIX</span><span className="block text-[10px] uppercase tracking-[.22em] text-slate-400">Gestão de ativos industriais</span></span>
        </a>
        <span className="hidden rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 sm:block">Cadastro de equipamentos</span>
      </div>
    </header>
    <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-10 sm:py-10">
      <nav aria-label="Localização" className="mb-8 flex items-center gap-2 text-xs text-slate-500"><Factory size={14}/> Industrix <ChevronRight size={13}/><span className="font-medium text-slate-800">Ativos Industriais</span></nav>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.2em] text-cyan-700">Organização para sua operação</p><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Ativos Industriais</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Todos os seus equipamentos em um só lugar. Consulte informações e mantenha o cadastro da operação atualizado.</p></div>
        <button onClick={() => open({ mode: 'create' })} className="primary-button shrink-0"><Plus size={18}/>Novo Ativo</button>
      </div>
      {notice && <div role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18}/>{notice}</div>}
      <section aria-label="Equipamentos cadastrados" className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-cyan-50 p-2 text-cyan-700"><Factory size={20}/></span><div><h2 className="font-semibold text-slate-900">Equipamentos cadastrados</h2><p className="mt-0.5 text-xs text-slate-500">Informações técnicas e situação dos ativos</p></div></div><button onClick={() => void load()} disabled={loading} className="secondary-button" aria-label="Atualizar ativos"><RefreshCw size={16} className={loading ? 'animate-spin' : ''}/><span className="hidden sm:inline">Atualizar</span></button></div>
        <div className="flex flex-wrap items-center gap-3 px-5 py-5 sm:px-6">
          <div className="relative min-w-52 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input aria-label="Pesquisar ativos" value={query} onChange={event => setQuery(event.target.value)} className="field pl-10" placeholder="Pesquisar código, nome, fabricante..."/></div>
          <SlidersHorizontal size={17} className="hidden text-slate-400 lg:block"/>
          <select aria-label="Filtrar por tipo" value={type} onChange={event => setType(event.target.value)} className="field w-auto flex-1 sm:flex-none"><option value="">Todos os tipos</option>{assetTypes.map(item => <option key={item} value={item}>{typeLabels[item]}</option>)}</select>
          <select aria-label="Filtrar por status" value={status} onChange={event => setStatus(event.target.value)} className="field w-auto flex-1 sm:flex-none"><option value="">Todos os status</option>{assetStatuses.map(item => <option key={item} value={item}>{statusLabels[item]}</option>)}</select>
          {hasFilters && <button className="text-xs font-semibold text-cyan-700 hover:underline" onClick={() => { setQuery(''); setType(''); setStatus(''); }}>Limpar filtros</button>}
        </div>
        {error ? <div role="alert" className="m-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-800"><AlertCircle className="mx-auto mb-3"/>{error}<button className="secondary-button mx-auto mt-4" onClick={() => void load()}>Tentar novamente</button></div> :
          <div className="overflow-x-auto"><table className="w-full text-left" aria-busy={loading}>
            <thead><tr className="border-y border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{['Código', 'Nome', 'Tipo', 'Fabricante', 'Modelo', 'Status', 'Ações'].map(label => <th scope="col" key={label} className="whitespace-nowrap px-6 py-3.5">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={7} className="px-6 py-20 text-center text-sm text-slate-500"><LoaderCircle className="mx-auto mb-3 animate-spin text-cyan-600"/>Carregando equipamentos...</td></tr> : filtered.length === 0 ?
              <tr><td colSpan={7} className="px-6 py-20 text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><PackageOpen size={30}/></span><p className="mt-5 font-semibold text-slate-800">{hasFilters ? 'Nenhum resultado para estes filtros' : 'Seu primeiro ativo começa aqui'}</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{hasFilters ? 'Ajuste a pesquisa ou limpe os filtros para encontrar outros equipamentos.' : 'Cadastre um equipamento para organizar as informações técnicas da sua operação.'}</p>{!hasFilters && <button className="primary-button mx-auto mt-6" onClick={() => open({ mode: 'create' })}>Cadastrar primeiro ativo<ArrowRight size={16}/></button>}</td></tr> : filtered.map(asset =>
                <tr key={asset.id} className="text-sm transition-colors hover:bg-cyan-50/40">
                  <td className="whitespace-nowrap px-6 py-5"><span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-semibold text-slate-700">{asset.code}</span></td>
                  <td className="min-w-48 max-w-72 break-words px-6 py-5 font-semibold text-slate-900">{asset.name}</td><td className="whitespace-nowrap px-6 py-5 text-slate-600">{typeLabels[asset.type]}</td><td className="max-w-48 break-words px-6 py-5 text-slate-600">{asset.manufacturer}</td><td className="max-w-48 break-words px-6 py-5 text-slate-600">{asset.model}</td><td className="whitespace-nowrap px-6 py-5"><StatusBadge status={asset.status}/></td>
                  <td className="px-6 py-5"><div className="flex gap-1"><button title="Visualizar" aria-label={`Visualizar ${asset.code}`} onClick={() => open({ mode: 'view', asset })} className="action-button hover:bg-cyan-50 hover:text-cyan-700"><Eye size={17}/></button><button title="Editar" aria-label={`Editar ${asset.code}`} onClick={() => open({ mode: 'edit', asset })} className="action-button hover:bg-cyan-50 hover:text-cyan-700"><Pencil size={17}/></button><button title="Excluir" aria-label={`Excluir ${asset.code}`} onClick={() => open({ mode: 'delete', asset })} className="action-button hover:bg-red-50 hover:text-red-700"><Trash2 size={17}/></button></div></td>
                </tr>)}</tbody>
          </table></div>}
        <footer className="flex flex-wrap justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500"><span>{loading ? 'Consultando cadastro...' : error ? 'Cadastro indisponível' : `${filtered.length} de ${assets.length} ativos`}</span><span>Código e número de série exclusivos por equipamento</span></footer>
      </section>
      <p className="mt-6 text-center text-[11px] text-slate-400">INDUSTRIX · Cadastro de Ativos Industriais</p>
    </main>
    {dialog && <Modal wide={dialog.mode === 'create' || dialog.mode === 'edit'} busy={saving} title={{ create: 'Novo Ativo', edit: 'Editar Ativo', view: 'Detalhes do Ativo', delete: 'Excluir ativo?' }[dialog.mode]} subtitle={dialog.mode === 'create' ? 'Preencha as informações do equipamento. Campos com * são obrigatórios.' : `${dialog.asset.code} · ${dialog.asset.name}`} onClose={close}>
      {dialog.mode === 'view' ? <AssetDetails asset={dialog.asset} onClose={close}/> : dialog.mode === 'delete' ?
        <div className="p-6"><div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 size={24}/></div><p className="text-sm leading-6 text-slate-600">O ativo <strong className="text-slate-900">{dialog.asset.name}</strong> será excluído permanentemente. Esta ação não pode ser desfeita.</p>{formError && <p role="alert" className="mt-4 text-sm text-red-700">{formError}</p>}<div className="mt-6 flex justify-end gap-3"><button disabled={saving} onClick={close} className="secondary-button">Cancelar</button><button disabled={saving} onClick={() => void remove()} className="primary-button bg-red-600 hover:bg-red-700">{saving ? 'Excluindo...' : 'Excluir ativo'}</button></div></div> :
        <AssetForm asset={dialog.mode === 'edit' ? dialog.asset : undefined} loading={saving} error={formError} onSubmit={submit} onCancel={close}/>}
    </Modal>}
  </div>;
}