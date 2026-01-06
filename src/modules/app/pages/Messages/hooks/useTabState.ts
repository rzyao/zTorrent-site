import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { MessageType } from '../types/types';
import { ALLOWED_TABS } from '../constants/constants';

export function useTabState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabRaw = (searchParams.get('tab') || 'inbox') as string;
  const initialTab = (ALLOWED_TABS.includes(initialTabRaw as MessageType) ? initialTabRaw : 'inbox') as MessageType;
  const [activeTab, setActiveTab] = useState<MessageType>(initialTab);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && (ALLOWED_TABS as readonly string[]).includes(t)) setActiveTab(t as MessageType);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('tab', activeTab);
      return p;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return { activeTab, setActiveTab } as const;
}

