import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // 数据立即视为过期，因此在窗口聚焦或组件挂载时会在后台重新获取（静默更新）
                staleTime: 0,
                // 将数据在缓存中保留 10 分钟（比默认的 5 分钟更长）
                // 这确保了用户返回页面时数据仍然可用，实现"秒开"体验
                gcTime: 1000 * 60 * 10,
                // 挂载时重新获取确保了如果组件重新挂载（例如点击后退按钮），
                // 我们会检查更新。由于缓存中有数据（gcTime），它会立即显示。
                refetchOnMount: true,
                // 可选：避免用户频繁切换标签页时进行过多的重新获取
                refetchOnWindowFocus: false,
                // 请求失败重试 1 次
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
