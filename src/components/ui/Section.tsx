import React from "react";

interface SectionProps {
  title: string;
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
  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section
      className={`bg-white rounded-lg shadow-sm p-6 ${className}`}
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="mb-6">
        <h2
          id={`${sectionId}-title`}
          className="text-xl font-semibold text-gray-900"
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-1 text-sm text-gray-600"
            id={`${sectionId}-description`}
          >
            {description}
          </p>
        )}
      </div>
      <div
        aria-describedby={description ? `${sectionId}-description` : undefined}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
