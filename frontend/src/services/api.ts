import type { Asset, AssetInput } from '../types/asset';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: string; errors?: Record<string, string[]> } | null;
    const validation = problem?.errors ? Object.values(problem.errors).flat().join(' ') : undefined;
    throw new Error(validation || problem?.detail || 'Não foi possível concluir a operação.');
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const assetService = {
  list: () => request<Asset[]>('/assets'),
  get: (id: string) => request<Asset>(`/assets/${id}`),
  create: (asset: AssetInput) => request<Asset>('/assets', { method: 'POST', body: JSON.stringify(asset) }),
  update: (id: string, asset: AssetInput) => request<Asset>(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(asset) }),
  remove: (id: string) => request<void>(`/assets/${id}`, { method: 'DELETE' }),
};
