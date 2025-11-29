import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Coffee, TrendingUp, Users, Calendar } from "lucide-react";
import MoodSelector from "./MoodSelector";
import DiscountManager from "./DiscountManager";
import QRGenerator from "./QRGenerator";
import {
  getAllCafes,
  getCafeById,
  getDiscountsByCafe,
  updateCafeMood,
  getActiveDiscountForCafe,
  subscribeToChanges,
} from "../utils/storage";

const CafeDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [activeDiscount, setActiveDiscount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeCafe();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToChanges(() => {
      loadCafeData();
    });

    return () => unsubscribe();
  }, []);

  const initializeCafe = async () => {
    try {
      loadCafeData();
    } catch (error) {
      console.error("Failed to initialize cafe:", error);
      setLoading(false);
    }
  };

  const loadCafeData = () => {
    try {
      const cafeData = getCafeById(currentUser.cafeID);
      const cafeDiscounts = getDiscountsByCafe(currentUser.cafeID);
      const active = getActiveDiscountForCafe(currentUser.cafeID);

      setCafe(cafeData);
      setDiscounts(cafeDiscounts);
      setActiveDiscount(active);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load cafe data:", error);
      setLoading(false);
    }
  };

  const handleMoodChange = async (mood) => {
    try {
      await updateCafeMood(currentUser.cafeID, mood);
      loadCafeData();
    } catch (error) {
      console.error("Failed to update mood:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Cafe Assigned
          </h2>
          <p className="text-gray-600 mb-4">
            Please contact an administrator to get a cafe assigned to your
            account.
          </p>
          <button onClick={handleLogout} className="btn-primary">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalDiscounts = discounts.length;
  const activeDiscountsCount = discounts.filter(
    (d) => d.isActive && new Date(d.validUntil) > new Date()
  ).length;
  const avgDiscount =
    discounts.length > 0
      ? Math.round(
          discounts.reduce((sum, d) => sum + d.percentage, 0) / discounts.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{cafe.logo}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {cafe.name}
                </h1>
                <p className="text-sm text-gray-600">{cafe.location}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{totalDiscounts}</span>
            </div>
            <p className="text-blue-100">Total Discounts</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{activeDiscountsCount}</span>
            </div>
            <p className="text-green-100">Active Discounts</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-bold">{avgDiscount}%</span>
            </div>
            <p className="text-purple-100">Average Discount</p>
          </div>
        </div>

        {/* Mood Selector */}
        <MoodSelector
          currentMood={cafe.currentMood}
          onMoodChange={handleMoodChange}
        />

        {/* Discount Manager */}
        <DiscountManager
          cafeID={cafe.cafeID}
          discounts={discounts}
          onDiscountsChange={loadCafeData}
        />

        {/* QR Generator */}
        <QRGenerator cafeData={cafe} discount={activeDiscount} />

        {/* Instructions */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Coffee className="w-6 h-6 text-indigo-600" />
            How It Works
          </h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">1.</span>
              <span>
                Update your cafe's current mood to let students know how busy
                you are
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">2.</span>
              <span>
                Create discounts with custom percentages and descriptions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">3.</span>
              <span>
                Generate and print QR codes for students to scan at your counter
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">4.</span>
              <span>
                Students will see your discounts in real-time on their mobile
                devices
              </span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default CafeDashboard;
