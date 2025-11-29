import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Coffee,
  MapPin,
  Percent,
  QrCode,
  User,
  Briefcase,
  Tag,
  Smartphone,
  Home,
} from "lucide-react";
import {
  getAllCafes,
  getActiveDiscountForCafe,
  cafeHasActiveDiscounts,
} from "../utils/storage";

const StudentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadCafes();
    checkIfMobile();
  }, []);

  const checkIfMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const mobile =
      mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < 768;
    setIsMobile(mobile);
  };

  const loadCafes = () => {
    const allCafes = getAllCafes();

    const cafesWithDiscounts = allCafes.map((cafe) => {
      const userDiscount = getActiveDiscountForCafe(
        cafe.cafeID,
        currentUser.userType
      );
      const hasAnyDiscount = cafeHasActiveDiscounts(cafe.cafeID);

      return {
        ...cafe,
        userDiscount,
        hasAnyDiscount,
      };
    });

    setCafes(cafesWithDiscounts);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleShowQR = (cafe) => {
    if (!cafe.userDiscount) {
      alert("No discount available for your user type at this cafe");
      return;
    }
    setSelectedCafe(cafe);
  };

  const getUserTypeLabel = () => {
    return currentUser.userType === "student" ? "Student" : "Staff Member";
  };

  const getUserTypeIcon = () => {
    return currentUser.userType === "student" ? (
      <User className="w-5 h-5" />
    ) : (
      <Briefcase className="w-5 h-5" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Available Discounts</h1>
                <div className="flex items-center gap-2 text-sm text-emerald-100">
                  {getUserTypeIcon()}
                  <span>
                    {getUserTypeLabel()}: {currentUser.name}
                  </span>
                </div>
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Available Cafes
          </h2>
          <p className="text-gray-600">
            Browse cafes and discover exclusive {currentUser.userType} discounts
          </p>
        </div>

        {/* Mobile Notice */}
        {!isMobile && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">
                  Mobile Required for QR Codes
                </h3>
                <p className="text-sm text-gray-600">
                  To claim discounts, please open this page on your mobile
                  device to scan QR codes at the cafe.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cafes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafes.map((cafe) => (
            <div
              key={cafe.cafeID}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all ${
                cafe.userDiscount ? "ring-2 ring-emerald-400" : ""
              }`}
            >
              {/* Cafe Photo */}
              <div className="h-48 bg-gray-200 relative">
                {cafe.photo ? (
                  <img
                    src={cafe.photo}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Coffee className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {cafe.userDiscount && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white px-3 py-2 rounded-lg shadow-lg">
                    <span className="text-2xl font-bold">
                      {cafe.userDiscount.percentage}%
                    </span>
                    <span className="text-xs block">OFF</span>
                  </div>
                )}

                {!cafe.userDiscount && cafe.hasAnyDiscount && (
                  <div className="absolute top-3 right-3 bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg">
                    <Tag className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs block">Other discounts</span>
                  </div>
                )}
              </div>

              {/* Cafe Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {cafe.name}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{cafe.location}</span>
                </div>

                {cafe.address && (
                  <p className="text-xs text-gray-500 mb-3">{cafe.address}</p>
                )}

                {/* Discount Info */}
                {cafe.userDiscount ? (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 mb-1">
                      <Percent className="w-4 h-4" />
                      <span className="font-bold">
                        {cafe.userDiscount.percentage}% Discount
                      </span>
                    </div>
                    <p className="text-sm text-emerald-600">
                      {cafe.userDiscount.description}
                    </p>
                    <p className="text-xs text-emerald-500 mt-1">
                      Valid until:{" "}
                      {new Date(
                        cafe.userDiscount.validUntil
                      ).toLocaleDateString()}
                    </p>
                  </div>
                ) : cafe.hasAnyDiscount ? (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      This cafe offers discounts for other user types
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">
                      No active discounts at this time
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {cafe.userDiscount ? (
                  isMobile ? (
                    <button
                      onClick={() => handleShowQR(cafe)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>Show QR Code</span>
                    </button>
                  ) : (
                    <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                      <Smartphone className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                      <p className="text-xs text-amber-700 font-medium">
                        Open on mobile to view QR code
                      </p>
                    </div>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                  >
                    No Discount Available
                  </button>
                )}

                {cafe.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      cafe.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>View on Map</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {cafes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <Coffee className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Cafes Available Yet
            </h3>
            <p className="text-gray-600">
              Check back soon for exclusive campus discounts!
            </p>
          </div>
        )}
      </main>

      {/* QR Code Modal - Only on Mobile */}
      {selectedCafe && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCafe(null)}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedCafe.name}
              </h2>
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
                {selectedCafe.userDiscount.percentage}% OFF
              </div>
              <p className="text-gray-600 mb-6">
                {selectedCafe.userDiscount.description}
              </p>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-lg mb-6 border-2 border-emerald-200">
                <QrCode className="w-32 h-32 mx-auto text-emerald-600" />
                <p className="text-sm text-emerald-700 mt-4 font-medium">
                  Show this to the cashier
                </p>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Valid until:{" "}
                {new Date(
                  selectedCafe.userDiscount.validUntil
                ).toLocaleString()}
              </div>

              <button
                onClick={() => setSelectedCafe(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
