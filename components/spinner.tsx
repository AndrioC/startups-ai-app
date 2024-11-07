import React from "react";

interface SpinnerProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function Spinner({ isLoading, children }: SpinnerProps) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex justify-center bg-transparent">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      <div className={isLoading ? "opacity-50" : ""}>{children}</div>
    </div>
  );
}
