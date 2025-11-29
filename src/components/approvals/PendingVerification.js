import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, LogOut } from "lucide-react";

export const PendingVerification = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Verification Pending
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for submitting your student information! An administrator
          will review your Student ID and verify your account shortly.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900 mb-1">
                What happens next?
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Admin reviews your Student ID photo</li>
                <li>• Verification typically takes 1-2 business days</li>
                <li>• You'll receive an email once approved</li>
                <li>• Log in again to access student discounts</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Back to Login</span>
        </button>
      </div>
    </div>
  );
};
