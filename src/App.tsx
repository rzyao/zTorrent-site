import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { AppToaster } from './components/ui/sonner';
import AppRoutes from './routes/AppRoutes';

// 全局认证事件
declare global {
  interface Window {
    dispatchAuthEvent: () => void;
  }
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return (
    <BrowserRouter>
      <AppToaster />
      <AppRoutes />
    </BrowserRouter>
  );
}
