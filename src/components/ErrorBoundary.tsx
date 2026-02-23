import React from 'react';
import { logEvent } from '../services/observabilityService';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logEvent({
      level: 'error',
      message: 'Unhandled UI error',
      context: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-lg w-full bg-white border border-red-200 rounded-lg shadow p-6">
            <h1 className="text-xl font-bold text-red-700 mb-2">Altus encountered an unexpected error</h1>
            <p className="text-gray-700 mb-4">
              The incident has been logged. Please reload the application. If the problem persists,
              contact your administrator.
            </p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
