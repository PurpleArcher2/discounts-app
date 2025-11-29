import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Search, Filter, Coffee, Bell } from "lucide-react";
import CafeCard from "./CafeCard";
import CafeDetail from "./CafeDetail";
import {
  getAllCafes,
  getAllDiscounts,
  getActiveDiscountForCafe,
  subscribeToChanges,
} from "../utils/storage";

const StudentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [cafes, setCafes] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [filteredCafes, setFilteredCafes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [moodFilter, setMoodFilter] = useState("All");
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    loadData();

    // Request notification permission on mobile
    if (window.innerWidth < 768 && "Notification" in window) {
      if (Notification.permission === "default") {
        requestNotificationPermission();
      } else if (Notification.permission === "granted") {
        setNotificationPermission(true);
      }
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeToChanges(() => {
      loadData();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    filterCafes();
  }, [cafes, discounts, searchTerm, moodFilter]);

  const loadData = () => {
    const cafesData = getAllCafes();
    const discountsData = getAllDiscounts();

    // Sort cafes by mood (Calm -> Moderate -> Crowded)
    const moodOrder = { Calm: 1, Moderate: 2, Crowded: 3 };
    const sortedCafes = cafesData.sort(
      (a, b) => moodOrder[a.currentMood] - moodOrder[b.currentMood]
    );

    setCafes(sortedCafes);
    setDiscounts(discountsData);
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationPermission(true);
        new Notification("Notifications Enabled", {
          body: "You'll now receive updates about new discounts!",
          icon: "☕",
        });
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  const filterCafes = () => {
    let filtered = cafes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (cafe) =>
          cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cafe.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by mood
    if (moodFilter !== "All") {
      filtered = filtered.filter((cafe) => cafe.currentMood === moodFilter);
    }

    setFilteredCafes(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCafeClick = (cafe) => {
    setSelectedCafe(cafe);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Campus Discounts
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {currentUser?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {notificationPermission && window.innerWidth < 768 && (
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Search and Filter - Desktop */}
          <div className="mt-4 hidden md:flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cafes or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="bg-transparent outline-none py-2 cursor-pointer"
              >
                <option value="All">All Moods</option>
                <option value="Calm">Calm</option>
                <option value="Moderate">Moderate</option>
                <option value="Crowded">Crowded</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter - Mobile */}
      <div className="md:hidden bg-white border-b px-4 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cafes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["All", "Calm", "Moderate", "Crowded"].map((mood) => (
            <button
              key={mood}
              onClick={() => setMoodFilter(mood)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                moodFilter === mood
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Cafe Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {filteredCafes.length === 0 ? (
          <div className="text-center py-16">
            <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No cafes found</p>
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCafes.map((cafe) => {
              const discount = getActiveDiscountForCafe(cafe.cafeID);
              return (
                <CafeCard
                  key={cafe.cafeID}
                  cafe={cafe}
                  discount={discount}
                  onClick={() => handleCafeClick(cafe)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 safe-area-bottom">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <Coffee className="w-6 h-6" />
            <span className="text-xs font-medium">Cafes</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">Search</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Cafe Detail Modal */}
      {selectedCafe && (
        <CafeDetail
          cafe={selectedCafe}
          discount={getActiveDiscountForCafe(selectedCafe.cafeID)}
          onClose={() => setSelectedCafe(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
