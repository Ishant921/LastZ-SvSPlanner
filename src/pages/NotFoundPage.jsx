import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-6xl mb-4">🤔</div>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Page not found
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Redirecting you home in 5 seconds...
      </p>
      <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full"
          style={{
            animation: "shrink 5.5s linear forwards",
          }}
        />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
