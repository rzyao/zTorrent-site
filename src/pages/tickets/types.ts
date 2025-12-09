export type TabType = 'myTickets' | 'management' | 'todos' | 'stats' | 'faq';

export interface TabItem {
  id: TabType;
  label: string;
  icon: JSX.Element;
  show: boolean;
}

