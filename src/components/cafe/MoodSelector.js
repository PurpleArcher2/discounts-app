import React, { useState } from "react";
import { Smile, Meh, Frown, Check } from "lucide-react";

const MoodSelector = ({ currentMood, onMoodChange }) => {
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const [updating, setUpdating] = useState(false);

  const moods = [
    {
      value: "Calm",
      label: "Calm",
      icon: Smile,
      emoji: "😊",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-700",
    },
    {
      value: "Moderate",
      label: "Moderate",
      icon: Meh,
      emoji: "🙂",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      textColor: "text-orange-700",
    },
    {
      value: "Crowded",
      label: "Crowded",
      icon: Frown,
      emoji: "😓",
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      textColor: "text-red-700",
    },
  ];

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setUpdating(true);

    try {
      await onMoodChange(mood);
      setTimeout(() => setUpdating(false), 500);
    } catch (error) {
      console.error("Failed to update mood:", error);
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Current Cafe Mood</h2>
        {updating && (
          <span className="text-sm text-gray-500 animate-pulse">
            Updating...
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Let students know how busy your cafe is right now
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.value;

          return (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              disabled={updating}
              className={`relative p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                isSelected
                  ? `${mood.bgColor} ${mood.borderColor} shadow-lg`
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-r ${mood.color} flex items-center justify-center`}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="text-5xl mb-3">{mood.emoji}</div>
                <Icon
                  className={`w-8 h-8 mx-auto mb-2 ${
                    isSelected ? mood.textColor : "text-gray-400"
                  }`}
                />
                <p
                  className={`font-bold text-lg ${
                    isSelected ? mood.textColor : "text-gray-700"
                  }`}
                >
                  {mood.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {mood.value === "Calm" && "Few customers"}
                  {mood.value === "Moderate" && "Normal traffic"}
                  {mood.value === "Crowded" && "Very busy"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Keep this updated throughout the day to help
          students plan their visits!
        </p>
      </div>
    </div>
  );
};

export default MoodSelector;
