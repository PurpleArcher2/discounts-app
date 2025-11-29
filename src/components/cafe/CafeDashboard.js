import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Coffee, Settings, Percent, Smile, Home } from "lucide-react";
import {
  getCafeById,
  getDiscountsByCafe,
  updateCafeMood,
} from "../utils/storage";
import MoodSelector from "./MoodSelector";
import CafeSettings from "./CafeSettings";
import DiscountManager from "./DiscountManager";

const CafeDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentCafe, setCurrentCafe] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [activeTab, setActiveTab] = useState("mood");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCafeData();
  }, [currentUser]);

  const loadCafeData = () => {
    try {
      if (!currentUser) {
        setLoading(false);
        setError("No user logged in");
        return;
      }

      if (!currentUser.cafeID) {
        setLoading(false);
        setError("No cafe associated with this account");
        return;
      }

      const cafe = getCafeById(currentUser.cafeID);

      if (!cafe) {
        setError("Cafe not found in database");
        setLoading(false);
        return;
      }

      setCurrentCafe(cafe);

      // Load discounts
      const cafeDiscounts = getDiscountsByCafe(cafe.cafeID);
      setDiscounts(cafeDiscounts);

      setLoading(false);
    } catch (err) {
      console.error("Error loading cafe:", err);
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleMoodChange = async (newMood) => {
    try {
      const updatedCafe = updateCafeMood(currentCafe.cafeID, newMood);
      setCurrentCafe(updatedCafe);
    } catch (error) {
      console.error("Failed to update mood:", error);
      alert("Failed to update cafe mood");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your cafe...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentCafe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-md">
          <Coffee className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Cafe Not Found"}
          </h2>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">{currentCafe.name}</h1>
                <p className="text-sm text-emerald-100">
                  Owner: {currentUser.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("mood")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === "mood"
                  ? "border-emerald-600 text-emerald-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <Smile className="w-5 h-5" />
              <span>Cafe Mood</span>
            </button>
            <button
              onClick={() => setActiveTab("discounts")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === "discounts"
                  ? "border-emerald-600 text-emerald-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <Percent className="w-5 h-5" />
              <span>Manage Discounts</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === "settings"
                  ? "border-emerald-600 text-emerald-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Cafe Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "mood" && (
          <MoodSelector
            currentMood={currentCafe.currentMood}
            onMoodChange={handleMoodChange}
          />
        )}

        {activeTab === "discounts" && (
          <DiscountManager
            cafeID={currentCafe.cafeID}
            discounts={discounts}
            onDiscountsChange={loadCafeData}
          />
        )}

        {activeTab === "settings" && (
          <CafeSettings cafe={currentCafe} onUpdate={loadCafeData} />
        )}
      </main>
    </div>
  );
};

export default CafeDashboard;
