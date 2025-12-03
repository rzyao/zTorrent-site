import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { AppToaster } from './components/ui/sonner';
import AppRoutes from './routes/AppRoutes';
import { AccessProvider } from '@/context/AccessContext';
import { UserSummaryProvider } from '@/context/UserSummaryContext';
import { useDictionaryStore } from './stores/dictionaryStore';

// 全局认证事件
declare global {
  interface Window {
    dispatchAuthEvent: () => void;
  }
}

export default function App() {
  const { fetchDictionaries } = useDictionaryStore();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Load dictionaries on app initialization
    fetchDictionaries();
  }, [fetchDictionaries]);

  return (
    <BrowserRouter>
      <AccessProvider>
        <UserSummaryProvider>
          <AppToaster />
          <AppRoutes />
        </UserSummaryProvider>
      </AccessProvider>
    </BrowserRouter>
  );
}
