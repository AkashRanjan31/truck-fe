import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-black text-white">Something went wrong</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            An unexpected error occurred. Please refresh the page or try again.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-left text-xs text-red-400 bg-slate-800 rounded-xl p-4 overflow-auto max-h-40">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mx-auto"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
