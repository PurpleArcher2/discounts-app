import React from "react";
import { MapPin, Tag, Coffee } from "lucide-react";

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
      className="card cursor-pointer transform hover:scale-105 animate-fade-in overflow-hidden"
    >
      {/* Cafe Photo */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {cafe.photo ? (
          <img
            src={cafe.photo}
            alt={cafe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <Coffee className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Mood Badge Overlay */}
        <div className="absolute top-3 right-3">
          <div
            className={`px-3 py-2 rounded-lg border-2 font-medium text-sm flex items-center gap-2 backdrop-blur-sm ${getMoodColor(
              cafe.currentMood
            )}`}
          >
            <span className="text-lg">{getMoodIcon(cafe.currentMood)}</span>
            <span>{cafe.currentMood}</span>
          </div>
        </div>

        {/* Discount Badge Overlay */}
        {discount && discount.isActive && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold shadow-md">
              <Tag className="w-5 h-5" />
              <span className="text-lg">{discount.percentage}% OFF</span>
            </div>
          </div>
        )}
      </div>

      {/* Cafe Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{cafe.name}</h3>

        <div className="flex items-start gap-1 text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{cafe.location}</span>
        </div>

        {discount && discount.description && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 line-clamp-2">
              {discount.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeCard;
