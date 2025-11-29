import React from "react";
import { useAuth } from "../../contexts/AuthContext"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, LogOut } from "react-feather"; // or another icon library you're using

export const PendingApproval = () => {
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
          Approval Pending
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for submitting your cafe information! An administrator will
          review your application and approve your cafe shortly.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-purple-900 mb-1">
                What happens next?
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Admin reviews your cafe details and photo</li>
                <li>• Approval typically takes 1-2 business days</li>
                <li>• You'll receive an email once approved</li>
                <li>• Log in again to access your cafe dashboard</li>
                <li>• Start creating discounts for students</li>
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
