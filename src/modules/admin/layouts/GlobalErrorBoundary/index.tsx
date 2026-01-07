import React from "react";
import { Result, Button } from "antd";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: any;
}

export class GlobalErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    // 这里可以接入上报
    console.error("Render error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <Result
          status="error"
          title="页面出现错误"
          subTitle={String(this.state.error?.message || this.state.error)}
          extra={
            <Button
              type="primary"
              onClick={() => this.setState({ error: null })}
            >
              重试
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
