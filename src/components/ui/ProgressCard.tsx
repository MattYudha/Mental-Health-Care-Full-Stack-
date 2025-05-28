import React from "react";
import { LucideIcon } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  onClick?: () => void;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  onClick,
  className = "",
}) => {
  const cardClasses = `bg-white rounded-lg p-4 shadow-sm ${
    onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
  } ${className}`;

  const CardWrapper = onClick ? "button" : "div";

  return (
    <CardWrapper
      className={cardClasses}
      onClick={onClick}
      type={onClick ? "button" : undefined}
      aria-label={onClick ? `${title}: ${value}` : undefined}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p
            className="text-2xl font-bold text-gray-900"
            aria-label={`${title} value: ${value}`}
          >
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-full ${iconBgColor}`} aria-hidden="true">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProgressCard;
