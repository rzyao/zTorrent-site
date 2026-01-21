import React from "react";
import { Button } from "@/modules/app/components/ui/button";
import { AlertCircle } from "lucide-react";
/**
 * 全局错误边界（应用端）
 * 说明：
 * - 使用 React 类组件实现 Error Boundary（函数组件暂不支持捕获渲染错误）
 * - 当子树发生渲染错误时，显示友好的降级界面，提供恢复与刷新操作
 * - 不做旧实现兼容；统一采用此组件作为顶层错误兜底
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  error: any;
}
export class AppGlobalErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }
  /**
   * 当后代组件抛出错误时，派生错误状态以触发兜底 UI
   */
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  /**
   * 捕获错误详情（可对接监控/日志上报系统）
   */
  componentDidCatch(error: any, info: any) {
    // 仅控制台输出，避免暴露敏感信息；生产可接入 Sentry/Datadog 等
    console.error("App render error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-neutral-900">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-neutral-100">
            页面渲染发生错误
          </h1>
          <p className="mb-6 max-w-md text-gray-600 dark:text-neutral-400">
            很抱歉，应用在渲染过程中出现异常。您可以尝试恢复当前页面或刷新站点。
          </p>
          <div className="mb-8">
            <span className="mt-2 block rounded bg-gray-100 p-2 font-mono text-xs text-red-600 dark:bg-neutral-800 dark:text-red-400">
              {String(this.state.error?.message || this.state.error)}
            </span>
          </div>
          <div className="flex gap-4">
            <Button variant="default" onClick={() => this.setState({ error: null })}>
              尝试恢复
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
