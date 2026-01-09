import { useState } from 'react';
import { useAuth, useTorrents } from '../hooks/useApi';
import { Button } from '@/modules/app/components/ui/button';

// 登录组件示例
export function LoginExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert('登录成功！');
    } catch (err) {
      console.error('登录失败:', err);
    }
  };

  if (isAuthenticated) {
    return <div>✅ 已登录</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="邮箱地址"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="密码"
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {isLoading ? '登录中...' : '登录'}
      </Button>
    </form>
  );
}

// 种子列表组件示例
export function TorrentListExample() {
  const { fetchTorrents, torrents, isLoading, error } = useTorrents();
  const [category, setCategory] = useState('');

  const loadTorrents = async () => {
    try {
      await fetchTorrents(category);
    } catch (err) {
      console.error('获取种子列表失败:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="分类筛选"
          className="flex-1 p-2 border rounded"
        />
        <Button
          onClick={loadTorrents}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? '加载中...' : '加载种子'}
        </Button>
      </div>
      
      {error && <div className="text-red-500">{error}</div>}
      
      {torrents && (
        <div className="space-y-2">
          <h3 className="font-bold">种子列表 ({torrents.total} 个)</h3>
          {torrents.data.map((torrent) => (
            <div key={torrent.id} className="border p-3 rounded">
              <h4 className="font-semibold">{torrent.title}</h4>
              <p className="text-sm text-gray-600">
                {torrent.category} | {torrent.size} | 做种: {torrent.seeders} | 下载: {torrent.leechers}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
