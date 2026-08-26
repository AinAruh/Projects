import { useState, type FormEvent } from 'react';
import { assetStatuses, assetTypes, statusLabels, type Asset, type AssetInput } from '../../../types/asset';
const typeLabels = { Motor: 'Motor', Pump: 'Bomba', Conveyor: 'Esteira', Tank: 'Tanque', Robot: 'Robô', Machine: 'Máquina', Other: 'Outro' } as const;
const empty: AssetInput = { code: '', name: '', description: '', type: 'Motor', manufacturer: '', model: '', serialNumber: '', status: 'Operating' };
interface Props { asset?: Asset; loading: boolean; onSubmit: (data: AssetInput) => Promise<void>; onCancel: () => void }
export function AssetForm({ asset, loading, onSubmit, onCancel }: Props) {
 const [data, setData] = useState<AssetInput>(asset ? (({ code, name, description, type, manufacturer, model, serialNumber, status }) => ({ code, name, description, type, manufacturer, model, serialNumber, status }))(asset) : empty);
 const update = (key: keyof AssetInput, value: string) => setData(current => ({ ...current, [key]: value }));
 const submit = (event: FormEvent) => { event.preventDefault(); void onSubmit(data); };
 const fieldClass = 'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/15';
 return <form onSubmit={submit} className="p-6"><div className="grid gap-5 sm:grid-cols-2">
  <label className="text-sm font-semibold text-slate-700">Código *<input required maxLength={30} className={fieldClass} value={data.code} onChange={e=>update('code',e.target.value)} placeholder="Ex.: MOT-001"/></label>
  <label className="text-sm font-semibold text-slate-700">Nome *<input required maxLength={120} className={fieldClass} value={data.name} onChange={e=>update('name',e.target.value)} placeholder="Nome do equipamento"/></label>
  <label className="text-sm font-semibold text-slate-700">Tipo *<select className={fieldClass} value={data.type} onChange={e=>update('type',e.target.value)}>{assetTypes.map(x=><option key={x} value={x}>{typeLabels[x]}</option>)}</select></label>
  <label className="text-sm font-semibold text-slate-700">Status *<select className={fieldClass} value={data.status} onChange={e=>update('status',e.target.value)}>{assetStatuses.map(x=><option key={x} value={x}>{statusLabels[x]}</option>)}</select></label>
  <label className="text-sm font-semibold text-slate-700">Fabricante *<input required maxLength={100} className={fieldClass} value={data.manufacturer} onChange={e=>update('manufacturer',e.target.value)} placeholder="Ex.: WEG"/></label>
  <label className="text-sm font-semibold text-slate-700">Modelo *<input required maxLength={100} className={fieldClass} value={data.model} onChange={e=>update('model',e.target.value)} placeholder="Modelo do equipamento"/></label>
  <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Número de série *<input required maxLength={100} className={fieldClass} value={data.serialNumber} onChange={e=>update('serialNumber',e.target.value)} placeholder="Número de série único"/></label>
  <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Descrição<textarea maxLength={500} rows={3} className={fieldClass} value={data.description} onChange={e=>update('description',e.target.value)} placeholder="Informações adicionais sobre o ativo"/></label>
 </div><footer className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button><button disabled={loading} className="rounded-lg bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-cyan-800 disabled:opacity-60">{loading ? 'Salvando...' : asset ? 'Salvar alterações' : 'Cadastrar ativo'}</button></footer></form>;
}
