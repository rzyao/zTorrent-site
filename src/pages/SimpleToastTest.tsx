import { addToast } from '@heroui/toast';
import { Button } from '../components/ui/button';

export function SimpleToastTest() {
  const showTestToast = () => {
    addToast({
      title: '测试 Toast',
      description: 'HeroUI Toast 组件正常工作！',
      color: 'success',
      timeout: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-8">Toast 功能测试</h1>
        <Button onClick={showTestToast} size="lg">
          点击测试 Toast
        </Button>
      </div>
    </div>
  );
}