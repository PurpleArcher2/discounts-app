import React from "react";
import { MapPin, Tag } from "lucide-react";

const CafeCard = ({ cafe, discount, onClick }) => {
  const getMoodColor = (mood) => {
    switch (mood) {
      case "Calm":
        return "mood-calm";
      case "Moderate":
        return "mood-moderate";
      case "Crowded":
        return "mood-crowded";
      default:
        return "mood-calm";
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "Calm":
        return "😊";
      case "Moderate":
        return "🙂";
      case "Crowded":
        return "😓";
      default:
        return "😊";
    }
  };

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer transform hover:scale-105 animate-fade-in"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{cafe.logo}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{cafe.name}</h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                <MapPin className="w-4 h-4" />
                <span>{cafe.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`px-3 py-2 rounded-lg border-2 font-medium text-sm flex items-center gap-2 ${getMoodColor(
              cafe.currentMood
            )}`}
          >
            <span className="text-lg">{getMoodIcon(cafe.currentMood)}</span>
            <span>{cafe.currentMood}</span>
          </div>

          {discount && discount.isActive && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold shadow-md">
              <Tag className="w-5 h-5" />
              <span className="text-lg">{discount.percentage}% OFF</span>
            </div>
          )}
        </div>

        {discount && discount.description && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{discount.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeCard;
