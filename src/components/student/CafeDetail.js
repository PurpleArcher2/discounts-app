import React, { useState } from "react";
import { X, MapPin, Tag, Smartphone, Monitor, CheckCircle } from "lucide-react";
import QRScanner from "./QRScanner";

const CafeDetail = ({ cafe, discount, onClose }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const isMobile = window.innerWidth < 768;

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

  const handleRedeemClick = () => {
    if (isMobile) {
      setShowScanner(true);
    }
  };

  const handleScanSuccess = (qrData) => {
    setShowScanner(false);
    setRedeemed(true);

    // Auto close after showing success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{cafe.logo}</div>
                <div>
                  <h2 className="text-3xl font-bold">{cafe.name}</h2>
                  <div className="flex items-center gap-2 text-purple-100 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{cafe.location}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Current Mood */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Current Status
              </h3>
              <div
                className={`px-4 py-3 rounded-xl border-2 font-medium flex items-center gap-3 ${getMoodColor(
                  cafe.currentMood
                )}`}
              >
                <span className="text-2xl">
                  {getMoodIcon(cafe.currentMood)}
                </span>
                <div>
                  <p className="font-bold">{cafe.currentMood}</p>
                  <p className="text-xs opacity-75">Updated in real-time</p>
                </div>
              </div>
            </div>

            {/* Active Discount */}
            {discount && discount.isActive ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Active Discount
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Tag className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-3xl font-bold text-purple-600">
                          {discount.percentage}% OFF
                        </p>
                        <p className="text-sm text-gray-600">
                          {discount.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Valid until:{" "}
                    {new Date(discount.validUntil).toLocaleDateString()}
                  </div>

                  {redeemed ? (
                    <div className="bg-green-100 border-2 border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      <span>Discount Redeemed!</span>
                    </div>
                  ) : isMobile ? (
                    <button
                      onClick={handleRedeemClick}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-5 h-5" />
                      <span>Scan QR to Redeem</span>
                    </button>
                  ) : (
                    <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Monitor className="w-5 h-5" />
                        <p className="font-medium">Desktop Mode</p>
                      </div>
                      <p className="text-sm">
                        Please switch to mobile to scan the QR code and redeem
                        this discount at the cafe.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600">
                  No active discounts at this moment
                </p>
                <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
              </div>
            )}

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                About
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-600 text-sm">
                  Visit {cafe.name} at {cafe.location} to enjoy great food and
                  exclusive student discounts!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
          cafeName={cafe.name}
        />
      )}
    </>
  );
};

export default CafeDetail;
