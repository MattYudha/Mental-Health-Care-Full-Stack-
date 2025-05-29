import React from "react";
import { Calendar, Heart, Target, Clock, Plus, Check } from "lucide-react";

const WellnessTrackerPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("activities");

  const recommendedActivities = [
    {
      id: 1,
      name: "Mindful Meditation",
      duration: "10 min",
      impact: "Reduces anxiety",
      category: "Mindfulness",
      completed: false,
    },
    {
      id: 2,
      name: "Nature Walk",
      duration: "30 min",
      impact: "Improves mood",
      category: "Physical",
      completed: false,
    },
    {
      id: 3,
      name: "Journaling",
      duration: "15 min",
      impact: "Emotional awareness",
      category: "Self-reflection",
      completed: true,
    },
    {
      id: 4,
      name: "Deep Breathing",
      duration: "5 min",
      impact: "Stress reduction",
      category: "Mindfulness",
      completed: true,
    },
    {
      id: 5,
      name: "Hobby Time",
      duration: "45 min",
      impact: "Healthy distraction",
      category: "Leisure",
      completed: false,
    },
  ];

  const moodTracking = [
    { day: "Mon", score: 7 },
    { day: "Tue", score: 6 },
    { day: "Wed", score: 8 },
    { day: "Thu", score: 7 },
    { day: "Fri", score: 6 },
    { day: "Sat", score: 8 },
    { day: "Sun", score: 9 },
  ];

  const getEmoji = (score: number) => {
    if (score >= 8) return "😊";
    if (score >= 6) return "🙂";
    if (score >= 4) return "😐";
    if (score >= 2) return "🙁";
    return "😞";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Wellness Tracker</h1>
        <p className="text-gray-600">
          Monitor and improve your mental and physical wellbeing
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "activities"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("activities")}
            >
              Recommended Activities
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "mood"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("mood")}
            >
              Mood Tracking
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === "progress"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              Progress Goals
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "activities" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Personalized Wellness Activities
                </h2>
                <button className="px-3 py-1 bg-teal-50 text-teal-600 rounded-md text-sm font-medium flex items-center hover:bg-teal-100 transition-colors">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Custom
                </button>
              </div>

              <div className="space-y-4">
                {recommendedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-lg border flex items-center ${
                      activity.completed
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full mr-4 ${
                        activity.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {activity.completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Heart className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-800">
                          {activity.name}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {activity.category}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" /> {activity.duration}
                        <span className="mx-2">•</span>
                        <span>{activity.impact}</span>
                      </div>
                    </div>
                    <button
                      className={`ml-4 px-3 py-1.5 rounded text-xs font-medium ${
                        activity.completed
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-teal-100 text-teal-600 hover:bg-teal-200"
                      }`}
                    >
                      {activity.completed ? "Completed" : "Start Now"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "mood" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Weekly Mood Tracker
                </h2>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-gray-500">June 10 - 16, 2023</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Today's Mood Check-in
                  </span>
                  <button className="px-3 py-1 bg-teal-50 text-teal-600 rounded-md text-xs font-medium hover:bg-teal-100 transition-colors">
                    Record Now
                  </button>
                </div>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        value >= 8
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : value >= 6
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : value >= 4
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Very Low</span>
                  <span>Very High</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-4">
                {moodTracking.map((day) => (
                  <div key={day.day} className="flex flex-col items-center">
                    <span className="text-sm text-gray-500 mb-2">
                      {day.day}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        day.score >= 8
                          ? "bg-green-100"
                          : day.score >= 6
                          ? "bg-blue-100"
                          : day.score >= 4
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {getEmoji(day.score)}
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">
                      {day.score}/10
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Mood Insights
                </h3>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  Your mood has been improving throughout the week. Weekend
                  activities seem to have a positive effect on your wellbeing.
                  Consider scheduling more leisure activities during weekdays as
                  well.
                </p>
              </div>
            </div>
          )}

          {activeTab === "progress" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Wellness Goals
                </h2>
                <button className="px-3 py-1 bg-teal-50 text-teal-600 rounded-md text-sm font-medium flex items-center hover:bg-teal-100 transition-colors">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Goal
                </button>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((goal) => (
                  <div
                    key={goal}
                    className="p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-800">
                        Meditate 3 times a week
                      </h3>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Target size={14} className="mr-1" />
                        Target: 3/week
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Progress: 2/3 completed this week
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WellnessTrackerPage;
