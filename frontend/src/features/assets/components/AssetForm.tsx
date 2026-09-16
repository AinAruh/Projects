import { useState, type FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import { assetStatuses, assetTypes, statusLabels, typeLabels, type Asset, type AssetInput } from '../../../types/asset';

const empty: AssetInput = {
  code: '', name: '', description: '', type: 'Motor',
  manufacturer: '', model: '', serialNumber: '', status: 'Operating',
};
const textFields = [
  { key: 'code', label: 'Código', placeholder: 'Ex.: MOT-001', max: 30, min: 2 },
  { key: 'name', label: 'Nome', placeholder: 'Nome do equipamento', max: 120, min: 2 },
  { key: 'manufacturer', label: 'Fabricante', placeholder: 'Ex.: WEG', max: 100, min: 1 },
  { key: 'model', label: 'Modelo', placeholder: 'Ex.: W22', max: 100, min: 1 },
  { key: 'serialNumber', label: 'Número de série', placeholder: 'Número de série exclusivo', max: 100, min: 1 },
] as const;

interface Props {
  asset?: Asset;
  loading: boolean;
  error?: string;
  onSubmit: (data: AssetInput) => Promise<void>;
  onCancel: () => void;
}

function toInput(asset: Asset): AssetInput {
  const { code, name, description, type, manufacturer, model, serialNumber, status } = asset;
  return { code, name, description, type, manufacturer, model, serialNumber, status };
}

export function AssetForm({ asset, loading, error, onSubmit, onCancel }: Props) {
  const [data, setData] = useState<AssetInput>(() => asset ? toInput(asset) : { ...empty });
  function update<K extends keyof AssetInput>(key: K, value: AssetInput[K]) {
    setData(current => ({ ...current, [key]: value }));
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    void onSubmit({
      ...data, code: data.code.trim(), name: data.name.trim(), description: data.description.trim(),
      manufacturer: data.manufacturer.trim(), model: data.model.trim(), serialNumber: data.serialNumber.trim(),
    });
  }

  return <form onSubmit={submit} className="p-6">
    <fieldset disabled={loading} className="grid gap-5 sm:grid-cols-2">
      <legend className="sr-only">Informações do equipamento</legend>
      {textFields.map(field => <div key={field.key} className={field.key === 'serialNumber' ? 'sm:col-span-2' : ''}>
        <label htmlFor={`asset-${field.key}`} className="text-sm font-semibold text-slate-700">{field.label} *</label>
        <input id={`asset-${field.key}`} required minLength={field.min} maxLength={field.max} className="field mt-1.5" value={data[field.key]} onChange={event => update(field.key, event.target.value)} placeholder={field.placeholder}/>
      </div>)}
      <div>
        <label htmlFor="asset-type" className="text-sm font-semibold text-slate-700">Tipo *</label>
        <select id="asset-type" className="field mt-1.5" value={data.type} onChange={event => update('type', event.target.value as AssetInput['type'])}>
          {assetTypes.map(type => <option key={type} value={type}>{typeLabels[type]}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="asset-status" className="text-sm font-semibold text-slate-700">Status *</label>
        <select id="asset-status" className="field mt-1.5" value={data.status} onChange={event => update('status', event.target.value as AssetInput['status'])}>
          {assetStatuses.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="asset-description" className="text-sm font-semibold text-slate-700">Descrição</label>
        <textarea id="asset-description" maxLength={500} rows={3} className="field mt-1.5 resize-y" value={data.description} onChange={event => update('description', event.target.value)} placeholder="Informações adicionais sobre o ativo"/>
        <p className="mt-1 text-right text-xs text-slate-400">{data.description.length}/500 caracteres</p>
      </div>
    </fieldset>
    {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <footer className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
      <button type="button" disabled={loading} onClick={onCancel} className="secondary-button">Cancelar</button>
      <button type="submit" disabled={loading} className="primary-button">{loading && <LoaderCircle size={16} className="animate-spin"/>}{loading ? 'Salvando...' : asset ? 'Salvar alterações' : 'Cadastrar ativo'}</button>
    </footer>
  </form>;
}