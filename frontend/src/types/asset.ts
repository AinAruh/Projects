export const assetTypes = ['Motor', 'Pump', 'Conveyor', 'Tank', 'Robot', 'Machine', 'Other'] as const;
export const assetStatuses = ['Operating', 'Stopped', 'Maintenance', 'Alarm', 'Offline'] as const;
export const statusLabels = { Operating: 'Operando', Stopped: 'Parado', Maintenance: 'Manutenção', Alarm: 'Alarme', Offline: 'Offline' } as const;

export type AssetType = (typeof assetTypes)[number];
export type AssetStatus = (typeof assetStatuses)[number];

export interface Asset {
  id: string;
  code: string;
  name: string;
  description: string;
  type: AssetType;
  manufacturer: string;
  model: string;
  serialNumber: string;
  status: AssetStatus;
  createdAt: string;
}

export type AssetInput = Omit<Asset, 'id' | 'createdAt'>;
