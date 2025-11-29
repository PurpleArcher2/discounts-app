import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, CheckCircle, AlertCircle, Smartphone } from "lucide-react";

const QRScanner = ({ onScanSuccess, onClose, cafeName }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      return (
        mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth < 768
      );
    };

    setIsMobile(checkMobile());

    if (checkMobile()) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Scan errors are normal, don't show them
        }
      );

      setScanning(true);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error("Scanner error:", err);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && scanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleScanSuccess = async (decodedText) => {
    try {
      const qrData = JSON.parse(decodedText);
      await stopScanner();
      setScanning(false);
      setSuccess(true);

      setTimeout(() => {
        onScanSuccess(qrData);
      }, 1500);
    } catch (err) {
      setError("Invalid QR code. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Scan QR Code</h2>
                <p className="text-emerald-100 mt-1">{cafeName}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!isMobile ? (
              // Desktop Warning
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200">
                  <Smartphone className="w-20 h-20 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Mobile Device Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    QR code scanning is only available on mobile devices.
                  </p>
                  <p className="text-sm text-gray-500 bg-white p-3 rounded-lg border border-amber-200">
                    Please open this page on your smartphone to scan the QR code
                    and claim your discount.
                  </p>
                </div>
              </div>
            ) : (
              // Mobile Scanner
              <>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 text-sm">
                      QR code scanned successfully!
                    </p>
                  </div>
                )}

                <div
                  className="relative bg-gray-900 rounded-xl overflow-hidden"
                  style={{ minHeight: "300px" }}
                >
                  <div id="qr-reader" className="w-full"></div>

                  {!scanning && !success && !error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                        <p>Initializing camera...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Position the QR code within the frame to scan
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
