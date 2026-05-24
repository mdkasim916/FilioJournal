import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6] px-6 text-center">
          <div className="max-w-md">
            <h1 className="font-serif text-[32px] font-bold text-[#1C1917] mb-4">
              Something went wrong.
            </h1>
            <p className="text-[#8A867D] mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, your journal
              entries are likely safe in your local storage.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#1A3626] text-[#FBF9F6] px-6 py-3 font-sans text-[14px] uppercase tracking-[1px] hover:bg-[#1A3626]/90 transition-all"
              >
                Reload Application
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="text-[#8A867D] hover:text-[#1C1917] text-[13px] underline"
              >
                Return to Landing Page
              </button>
            </div>
            {import.meta.env.DEV && (
              <pre className="mt-10 p-4 bg-red-50 text-red-700 text-left overflow-auto text-xs border border-red-100">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
