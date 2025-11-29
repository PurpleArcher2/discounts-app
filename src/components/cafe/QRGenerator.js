import React, { useState } from "react";
import QRCode from "react-qr-code";
import { Download, QrCode as QrCodeIcon, Printer } from "lucide-react";

const QRGenerator = ({ cafeData, discount }) => {
  const [qrSize, setQrSize] = useState(256);

  const qrData = JSON.stringify({
    cafeID: cafeData.cafeID,
    cafeName: cafeData.name,
    discountID: discount?.discountID,
    discountPercentage: discount?.percentage,
    timestamp: new Date().toISOString(),
  });

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = qrSize;
    canvas.height = qrSize;

    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${cafeData.name}-QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const printQR = () => {
    const printWindow = window.open("", "_blank");
    const qrContent = document.getElementById("qr-code-container").innerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${cafeData.name}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .print-container {
              text-align: center;
              padding: 40px;
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            .discount-info {
              font-size: 24px;
              color: #7c3aed;
              font-weight: bold;
              margin: 20px 0;
            }
            @media print {
              body {
                background: white;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1>${cafeData.name}</h1>
            ${qrContent}
            ${
              discount
                ? `<div class="discount-info">${discount.percentage}% OFF - ${discount.description}</div>`
                : ""
            }
            <p style="margin-top: 20px; color: #666;">Scan to redeem discount</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <QrCodeIcon className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">QR Code Generator</h2>
      </div>

      {!discount || !discount.isActive ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <QrCodeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            Create an active discount to generate a QR code
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 mb-6">
            <div id="qr-code-container" className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
                <QRCode
                  id="qr-code-svg"
                  value={qrData}
                  size={qrSize}
                  level="H"
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">
                  {cafeData.name}
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {discount.percentage}% OFF
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {discount.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <label className="text-sm font-medium text-gray-700">
                QR Code Size:
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-16">{qrSize}px</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={downloadQR}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={printQR}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <Printer className="w-5 h-5" />
                <span>Print QR Code</span>
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Instructions:</strong> Print this QR code and display it
              at your counter. Students can scan it with their mobile devices to
              redeem the discount.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default QRGenerator;
