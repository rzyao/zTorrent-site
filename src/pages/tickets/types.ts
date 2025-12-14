import type { ReactElement } from 'react';

export type TabType = 'myTickets' | 'management' | 'todos' | 'stats' | 'faq';

export interface TabItem {
  id: TabType;
  label: string;
  icon: ReactElement;
  show: boolean;
}

