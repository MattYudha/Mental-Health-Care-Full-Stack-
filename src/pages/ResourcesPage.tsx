import React, { useState } from "react";
import {
  Search,
  ExternalLink,
  PhoneCall,
  BookOpen,
  Users,
  Video,
  FileText,
  MapPin,
  Star,
  Clock,
  Calendar,
} from "lucide-react";

const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Resources", icon: <BookOpen size={16} /> },
    { id: "hotlines", name: "Hotlines", icon: <PhoneCall size={16} /> },
    { id: "articles", name: "Articles", icon: <FileText size={16} /> },
    { id: "videos", name: "Videos", icon: <Video size={16} /> },
    { id: "groups", name: "Support Groups", icon: <Users size={16} /> },
  ];

  const resources = [
    {
      id: 1,
      title: "National Problem Gambling Helpline",
      description:
        "24/7 confidential helpline for those experiencing gambling problems",
      type: "hotlines",
      contact: "1-800-522-4700",
      website:
        "https://www.ncpgambling.org/help-treatment/national-helpline-1-800-522-4700/",
      featured: true,
    },
    {
      id: 2,
      title: "Understanding Gambling Addiction",
      description:
        "Comprehensive guide to understanding the causes and effects of gambling addiction",
      type: "articles",
      source: "American Addiction Centers",
      readTime: "8 min read",
      featured: true,
    },
    {
      id: 3,
      title: "Gamblers Anonymous Online Meetings",
      description:
        "Virtual support group meetings for people dealing with gambling problems",
      type: "groups",
      schedule: "Multiple times daily",
      website: "https://www.gamblersanonymous.org",
    },
    {
      id: 4,
      title: "Cognitive Behavioral Techniques for Addiction",
      description: "Learn practical CBT techniques to manage gambling urges",
      type: "videos",
      duration: "18 minutes",
      source: "Mental Health Foundation",
    },
    {
      id: 5,
      title: "Financial Recovery After Gambling Losses",
      description:
        "Step-by-step guide to rebuilding finances after gambling problems",
      type: "articles",
      source: "Financial Wellness Institute",
      readTime: "12 min read",
    },
    {
      id: 6,
      title: "SAMHSA National Helpline",
      description:
        "Treatment referral and information service for individuals facing mental health challenges",
      type: "hotlines",
      contact: "1-800-662-4357",
      website: "https://www.samhsa.gov/find-help/national-helpline",
    },
    {
      id: 7,
      title: "Mindfulness for Addiction Recovery",
      description:
        "How mindfulness practices can support recovery from addictive behaviors",
      type: "videos",
      duration: "22 minutes",
      source: "Mindfulness Center",
    },
    {
      id: 8,
      title: "Local Support Groups Directory",
      description:
        "Find in-person gambling addiction support groups in your area",
      type: "groups",
      locations: "Nationwide",
      website:
        "https://www.ncpgambling.org/help-treatment/treatment-facilities/",
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === "all" || resource.type === activeCategory;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter((resource) => resource.featured);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Support Resources</h1>
        <p className="text-gray-600">
          Access professional help and educational materials
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex overflow-x-auto md:overflow-visible space-x-2 pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {featuredResources.length > 0 &&
          activeCategory === "all" &&
          searchQuery === "" && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Featured Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="border border-teal-200 bg-teal-50 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <div className="bg-teal-100 p-2 rounded-full text-teal-600 mr-3">
                        {resource.type === "hotlines" ? (
                          <PhoneCall size={20} />
                        ) : resource.type === "articles" ? (
                          <FileText size={20} />
                        ) : resource.type === "videos" ? (
                          <Video size={20} />
                        ) : (
                          <Users size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-medium text-gray-800">
                            {resource.title}
                          </h3>
                          <div className="flex items-center">
                            <Star
                              size={14}
                              className="text-yellow-500 fill-current"
                            />
                            <span className="text-xs text-gray-500 ml-1">
                              Featured
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {resource.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center text-sm">
                          {resource.type === "hotlines" && (
                            <div className="mr-4 flex items-center text-blue-600">
                              <PhoneCall size={14} className="mr-1" />
                              <span>{resource.contact}</span>
                            </div>
                          )}

                          {resource.type === "articles" && (
                            <div className="mr-4 flex items-center text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>{resource.readTime}</span>
                            </div>
                          )}

                          {(resource.website || resource.source) && (
                            <a
                              href="#"
                              className="flex items-center text-teal-600 hover:text-teal-700 mt-2"
                            >
                              <ExternalLink size={14} className="mr-1" />
                              <span>
                                Visit {resource.website ? "Website" : "Source"}
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {activeCategory === "all"
              ? "All Resources"
              : activeCategory === "hotlines"
              ? "Helplines & Hotlines"
              : activeCategory === "articles"
              ? "Articles & Guides"
              : activeCategory === "videos"
              ? "Videos & Webinars"
              : "Support Groups"}
          </h2>

          {filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No resources found. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="border border-gray-200 rounded-lg p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    <div
                      className={`p-2 rounded-full mr-3 ${
                        resource.type === "hotlines"
                          ? "bg-blue-100 text-blue-600"
                          : resource.type === "articles"
                          ? "bg-purple-100 text-purple-600"
                          : resource.type === "videos"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {resource.type === "hotlines" ? (
                        <PhoneCall size={20} />
                      ) : resource.type === "articles" ? (
                        <FileText size={20} />
                      ) : resource.type === "videos" ? (
                        <Video size={20} />
                      ) : (
                        <Users size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-800">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {resource.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center text-sm space-x-4">
                        {resource.type === "hotlines" && (
                          <div className="flex items-center text-blue-600">
                            <PhoneCall size={14} className="mr-1" />
                            <span>{resource.contact}</span>
                          </div>
                        )}

                        {resource.type === "articles" && resource.source && (
                          <div className="flex items-center text-gray-500">
                            <BookOpen size={14} className="mr-1" />
                            <span>{resource.source}</span>
                          </div>
                        )}

                        {resource.type === "articles" && resource.readTime && (
                          <div className="flex items-center text-gray-500">
                            <Clock size={14} className="mr-1" />
                            <span>{resource.readTime}</span>
                          </div>
                        )}

                        {resource.type === "videos" && resource.duration && (
                          <div className="flex items-center text-gray-500">
                            <Clock size={14} className="mr-1" />
                            <span>{resource.duration}</span>
                          </div>
                        )}

                        {resource.type === "groups" && resource.schedule && (
                          <div className="flex items-center text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            <span>{resource.schedule}</span>
                          </div>
                        )}

                        {(resource.website ||
                          resource.contact ||
                          resource.source) && (
                          <a
                            href={resource.website || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-teal-600 hover:text-teal-700 mt-2"
                          >
                            <ExternalLink size={14} className="mr-1" />
                            <span>
                              {resource.website
                                ? "Visit Website"
                                : resource.contact
                                ? "Call Helpline"
                                : resource.source
                                ? "View Source"
                                : "Learn More"}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
