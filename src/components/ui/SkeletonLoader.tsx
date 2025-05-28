import React from "react";

interface SkeletonLoaderProps {
  type?: "text" | "card" | "avatar" | "button";
  className?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "text",
  className = "",
  count = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-200 rounded";

  const getTypeClasses = () => {
    switch (type) {
      case "text":
        return "h-4 w-3/4";
      case "card":
        return "h-32 w-full";
      case "avatar":
        return "h-12 w-12 rounded-full";
      case "button":
        return "h-10 w-24";
      default:
        return "h-4 w-3/4";
    }
  };

  const renderSkeleton = () => {
    const typeClasses = getTypeClasses();
    return (
      <div
        className={`${baseClasses} ${typeClasses} ${className}`}
        role="status"
        aria-label="Loading"
      />
    );
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
