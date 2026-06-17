import React, { Component } from "react";

/**
 * Error boundary that catches crashes in its child components.
 * Shows a friendly error UI instead of breaking the whole website.
 *
 * Usage:
 *   <ErrorBoundary onReset={() => setKey(key + 1)}>
 *     <MyTool />
 *   </ErrorBoundary>
 *
 * Props:
 *   - children: The component tree to protect
 *   - onReset: Callback to reset the error state (e.g., increment a key)
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
    this.props.onReset?.();
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl px-8 py-6 max-w-md mx-4 text-center">
            {/* Error icon */}
            <div className="text-4xl mb-4">⚠️</div>

            {/* Message */}
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This tool encountered an error. You can try reloading it.
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition"
              >
                Reload Tool
              </button>
            </div>

            {/* Details toggle */}
            <button
              onClick={this.toggleDetails}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              {this.state.showDetails ? "Hide details" : "Show details"}
            </button>

            {/* Technical details */}
            {this.state.showDetails && this.state.error && (
              <div className="mt-3 text-left">
                <pre className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
