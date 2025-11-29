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
  Monitor,
} from "lucide-react";
import QRCode from "react-qr-code";
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

    // Listen for window resize
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const checkIfMobile = () => {
    const mobile =
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
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

  const getMoodStyles = (mood) => {
    switch (mood) {
      case "Calm":
        return "bg-green-100 border-green-300 text-green-700";
      case "Moderate":
        return "bg-orange-100 border-orange-300 text-orange-700";
      case "Crowded":
        return "bg-red-100 border-red-300 text-red-700";
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  const getMoodEmoji = (mood) => {
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

  const qrData = selectedCafe
    ? JSON.stringify({
        cafeID: selectedCafe.cafeID,
        cafeName: selectedCafe.name,
        discountID: selectedCafe.userDiscount?.discountID,
        discountPercentage: selectedCafe.userDiscount?.percentage,
        userID: currentUser.userID,
        userType: currentUser.userType,
        timestamp: new Date().toISOString(),
      })
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Campus Discounts</h1>
                <div className="flex items-center gap-2 text-sm text-purple-100">
                  {getUserTypeIcon()}
                  <span>
                    {getUserTypeLabel()}: {currentUser.name}
                  </span>
                </div>
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Available Cafes
          </h2>
          <p className="text-gray-600">
            Browse cafes and discover exclusive {currentUser.userType} discounts
          </p>
        </div>

        {/* Cafes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafes.map((cafe) => (
            <div
              key={cafe.cafeID}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all ${
                cafe.userDiscount ? "ring-2 ring-purple-400" : ""
              }`}
            >
              {/* Cafe Photo */}
              <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 relative flex items-center justify-center">
                {cafe.photo ? (
                  <img
                    src={cafe.photo}
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Coffee className="w-16 h-16 text-purple-400" />
                )}

                {/* Mood Badge */}
                <div className="absolute top-3 left-3">
                  <div
                    className={`px-3 py-2 rounded-lg border-2 font-medium text-sm flex items-center gap-2 backdrop-blur-sm ${getMoodStyles(
                      cafe.currentMood
                    )}`}
                  >
                    <span className="text-lg">
                      {getMoodEmoji(cafe.currentMood)}
                    </span>
                    <span>{cafe.currentMood}</span>
                  </div>
                </div>

                {/* Discount Badge */}
                {cafe.userDiscount && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg shadow-lg">
                    <span className="text-2xl font-bold">
                      {cafe.userDiscount.percentage}%
                    </span>
                    <span className="text-xs block">OFF</span>
                  </div>
                )}

                {/* "Other Discounts Available" Badge */}
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
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700 mb-1">
                      <Percent className="w-4 h-4" />
                      <span className="font-bold">
                        {cafe.userDiscount.percentage}% Discount
                      </span>
                    </div>
                    <p className="text-sm text-purple-600">
                      {cafe.userDiscount.description}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
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
                  <button
                    onClick={() => handleShowQR(cafe)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Show QR Code</span>
                  </button>
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

      {/* QR Code Modal - Mobile Only */}
      {selectedCafe && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCafe(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedCafe.name}
              </h2>
              <div className="text-4xl font-bold text-purple-600 mb-4">
                {selectedCafe.userDiscount.percentage}% OFF
              </div>
              <p className="text-gray-600 mb-6">
                {selectedCafe.userDiscount.description}
              </p>

              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg mb-6 flex justify-center">
                <QRCode
                  value={qrData}
                  size={200}
                  level="H"
                  className="mx-auto"
                />
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Valid until:{" "}
                {new Date(
                  selectedCafe.userDiscount.validUntil
                ).toLocaleString()}
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Show this QR code to the cashier to redeem your discount
              </p>

              <button
                onClick={() => setSelectedCafe(null)}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Warning Modal */}
      {selectedCafe && !isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCafe(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Mobile Device Required
              </h2>
              <p className="text-gray-600 mb-6">
                QR codes can only be displayed on mobile devices. Please open
                this page on your phone to view and redeem your discount.
              </p>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-800">
                    How to access on mobile:
                  </p>
                </div>
                <ol className="text-left text-sm text-blue-700 space-y-2">
                  <li>1. Open your browser on your phone</li>
                  <li>2. Navigate to this website</li>
                  <li>3. Log in with your account</li>
                  <li>4. Click "Show QR Code" for any cafe</li>
                </ol>
              </div>

              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>{selectedCafe.name}</strong>
                </p>
                <p className="text-2xl font-bold text-purple-600 mb-1">
                  {selectedCafe.userDiscount.percentage}% OFF
                </p>
                <p className="text-xs text-gray-600">
                  {selectedCafe.userDiscount.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedCafe(null)}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
