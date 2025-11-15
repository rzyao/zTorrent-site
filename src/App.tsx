import { BrowserRouter } from 'react-router-dom';
import { AppToaster } from './components/ui/sonner';
import AppRoutes from './routes/AppRoutes';

// 全局认证事件
declare global {
  interface Window {
    dispatchAuthEvent: () => void;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AppToaster />
      <AppRoutes />
    </BrowserRouter>
  );
}
