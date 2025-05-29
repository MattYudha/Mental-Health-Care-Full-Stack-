// src/components/dashboard/StatCard.tsx
import React from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  description,
}) => {
  let trendIcon = null;
  let changeColorClass = "text-gray-500"; // Default for neutral or no change

  if (trend === "up") {
    // Upward trend is good (e.g., activities, streak) or bad (e.g., risk score)
    // Assuming 'up' in change means increase. Color depends on context.
    // For risk score, 'up' is red. For activities, 'up' is green.
    // This example assumes 'up' generally positive unless specified by a negative change.
    trendIcon = <ArrowUp className="h-4 w-4 mr-1" />;
    if (change && !change.startsWith("-") && change !== "0%") {
      changeColorClass = "text-green-500";
    } else if (change && change.startsWith("-")) {
      changeColorClass = "text-red-500"; // If change is explicitly negative
    }
  } else if (trend === "down") {
    // Downward trend is good (e.g., risk score) or bad (e.g., activities)
    // This example assumes 'down' is generally an improvement.
    trendIcon = <ArrowDown className="h-4 w-4 mr-1" />;
    if (change && !change.startsWith("+") && change !== "0%") {
      // If change indicates decrease or is negative
      changeColorClass = "text-green-500";
    } else if (change && change.startsWith("+")) {
      changeColorClass = "text-red-500";
    }
  } else if (trend === "neutral") {
    trendIcon = <Minus className="h-4 w-4 text-gray-500 mr-1" />;
  }

  // Specific override for risk score where 'down' is green and 'up' is red for the icon itself
  if (title === "Current Risk Score") {
    if (trend === "down")
      trendIcon = <ArrowDown className="h-4 w-4 text-green-500 mr-1" />;
    else if (trend === "up")
      trendIcon = <ArrowUp className="h-4 w-4 text-red-500 mr-1" />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-gray-100 text-gray-600">{icon}</div>
      </div>
      {change && trend && (
        <div className="flex items-center mt-4">
          {trendIcon}
          <span className={`text-sm font-medium ${changeColorClass}`}>
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-2">{description}</span>
        </div>
      )}
      {(!change || !trend) && (
        <div className="mt-4">
          <span className="text-sm text-gray-500">{description}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
