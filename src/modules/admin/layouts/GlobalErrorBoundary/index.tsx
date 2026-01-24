import React from "react";
import { Button } from "@/modules/admin/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: any;
}

export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, info: any) {
    // 这里可以接入监控上报系统（如 Sentry）
    console.error("Render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">页面渲染崩溃</h1>
          <p className="mb-8 max-w-md text-gray-600">
            {this.state.error?.message?.includes("Failed to fetch dynamically imported module")
              ? "检测到版本更新，页面资源加载失败。请刷新页面以加载最新版本。"
              : "很抱歉，当前模块在渲染时发生了未知错误。我们已经记录了此问题。"}
            <br />
            <span className="mt-2 block rounded bg-gray-100 p-2 font-mono text-xs text-red-500">
              {String(this.state.error?.message || this.state.error)}
            </span>
          </p>
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => this.setState({ error: null })}>
              尝试恢复
            </Button>
            <Button variant="default" onClick={() => window.location.reload()}>
              刷新整个页面
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
