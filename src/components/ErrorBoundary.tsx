import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-red-500 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 font-mono">SYSTEM_CRITICAL_ERROR</h2>
          <p className="font-mono text-sm mb-6 max-w-md">
            The kernel has encountered an unrecoverable state. 
            Please initiate manual recovery or restart the session.
          </p>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl font-mono text-[10px] text-left overflow-auto max-h-48 w-full">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2 bg-red-500 text-black rounded-lg font-bold hover:bg-red-400 transition-colors"
          >
            RESTART KERNEL
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
