import React, { useState } from "react";
import {
  X,
  MapPin,
  Tag,
  Smartphone,
  Monitor,
  CheckCircle,
  Coffee,
  Navigation,
} from "lucide-react";
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

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const openInGoogleMaps = () => {
    const address = cafe.address || cafe.location;
    const encodedAddress = encodeURIComponent(address);

    // Check if on mobile device
    if (isMobile) {
      // Try to open in Google Maps app, fallback to browser
      window.location.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    } else {
      // Open in new tab on desktop
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank"
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
          {/* Header with Photo */}
          <div className="relative">
            {cafe.photo ? (
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cafe.photo}
                  alt={cafe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{cafe.name}</h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>{cafe.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Coffee className="w-16 h-16" />
                    <div>
                      <h2 className="text-3xl font-bold">{cafe.name}</h2>
                      <div className="flex items-center gap-2 text-purple-100 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{cafe.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-lg transition-all shadow-lg"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
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

            {/* Location with Google Maps */}
            {(cafe.address || cafe.location) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Location
                </h3>
                <button
                  onClick={openInGoogleMaps}
                  className="w-full bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-4 hover:from-blue-100 hover:to-green-100 transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Navigation className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {cafe.location}
                        </p>
                        {cafe.address && cafe.address !== cafe.location && (
                          <p className="text-sm text-gray-600 mt-1">
                            {cafe.address}
                          </p>
                        )}
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          Tap to open in Google Maps
                        </p>
                      </div>
                    </div>
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  </div>
                </button>
              </div>
            )}

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
