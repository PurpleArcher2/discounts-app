import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Coffee,
  Settings as SettingsIcon,
  Percent,
} from "lucide-react";
import { getCafeById } from "../utils/storage";

// Import components - comment these out if they cause errors
import CafeSettings from "./CafeSettings";
import DiscountManager from "./DiscountManager";

const CafeDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentCafe, setCurrentCafe] = useState(null);
  const [activeTab, setActiveTab] = useState("discounts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("CafeDashboard mounted");
    console.log("Current user:", currentUser);
    loadCafeData();
  }, [currentUser]);

  const loadCafeData = () => {
    try {
      console.log("Loading cafe data...");

      if (!currentUser) {
        console.log("No current user");
        setLoading(false);
        setError("No user logged in");
        return;
      }

      if (!currentUser.cafeID) {
        console.log("User has no cafeID:", currentUser);
        setLoading(false);
        setError("No cafe associated with this account");
        return;
      }

      console.log("Fetching cafe with ID:", currentUser.cafeID);
      const cafe = getCafeById(currentUser.cafeID);
      console.log("Cafe found:", cafe);

      if (!cafe) {
        setError("Cafe not found in database");
        setLoading(false);
        return;
      }

      setCurrentCafe(cafe);
      setLoading(false);
    } catch (err) {
      console.error("Error loading cafe:", err);
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your cafe...</p>
          <p className="text-xs text-gray-400 mt-2">
            User: {currentUser?.email}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentCafe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-md">
          <Coffee className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Cafe Not Found"}
          </h2>
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Debug Info:</p>
            <p className="text-xs text-gray-500">
              User ID: {currentUser?.userID}
            </p>
            <p className="text-xs text-gray-500">
              Cafe ID: {currentUser?.cafeID || "None"}
            </p>
            <p className="text-xs text-gray-500">
              User Type: {currentUser?.userType}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">{currentCafe.name}</h1>
                <p className="text-sm text-purple-100">
                  Owner: {currentUser.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("discounts")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === "discounts"
                  ? "border-purple-600 text-purple-600 font-medium"
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
                  ? "border-purple-600 text-purple-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Cafe Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "discounts" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Discount Manager
            </h2>
            <p className="text-gray-600 mb-4">Cafe ID: {currentCafe.cafeID}</p>
            <DiscountManager cafeID={currentCafe.cafeID} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Cafe Settings
            </h2>
            <CafeSettings cafe={currentCafe} onUpdate={loadCafeData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default CafeDashboard;
