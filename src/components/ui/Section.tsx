import React from "react";

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {children}
      </div>
    </section>
  );
};

export default Section;
