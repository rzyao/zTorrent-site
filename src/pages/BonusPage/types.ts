export type BonusTab = 'overview' | 'records' | 'shop';

export type RecordType = 'earn' | 'spend';

export interface MagicRecord {
  id: string;
  type: RecordType;
  amount: number;
  reason: string;
  description: string;
  timestamp: string;
  icon: any;
}

