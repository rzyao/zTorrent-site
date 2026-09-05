import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // 默认 2 分钟内数据视为新鲜，避免每次切换路由都出现界面加载闪烁和重复请求
                staleTime: 1000 * 60 * 2,
                // 将数据在缓存中保留 10 分钟，确保返回页面时实现秒开
                gcTime: 1000 * 60 * 10,
                // 仅在数据过期时重新获取
                refetchOnMount: true,
                // 避免用户切换窗口时重复触发请求
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
