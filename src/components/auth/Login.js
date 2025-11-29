import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Coffee,
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  User,
  Briefcase,
  ShoppingBag,
} from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.userType === "admin") {
        navigate("/admin");
      } else if (user.userType === "student") {
        if (user.verified === false) {
          navigate("/pending-verification");
        } else {
          navigate("/student/dashboard");
        }
      } else if (user.userType === "staff") {
        if (user.verified === false) {
          navigate("/pending-verification");
        } else {
          navigate("/student/dashboard");
        }
      } else if (user.userType === "cafe") {
        if (!user.cafeID) {
          navigate("/pending-approval");
        } else {
          navigate("/cafe/dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(formData.email, formData.password);
  };

  const quickLogin = async (email, password) => {
    setFormData({ email, password });
    await handleLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <p className="text-sm font-bold text-gray-800 mb-3 text-center">
            🎭 Demo Accounts - Click to Auto-Fill
          </p>

          {/* Student Account */}
          <button
            onClick={() => quickLogin("student@campus.com", "student123")}
            className="w-full mb-2 p-3 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Student Account
                </p>
                <p className="text-xs text-gray-600 font-mono">
                  student@campus.com
                </p>
              </div>
            </div>
          </button>

          {/* Staff Account */}
          <button
            onClick={() => quickLogin("staff@campus.com", "staff123")}
            className="w-full mb-2 p-3 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Staff Account
                </p>
                <p className="text-xs text-gray-600 font-mono">
                  staff@campus.com
                </p>
              </div>
            </div>
          </button>

          {/* Cafe Accounts */}
          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Cafe Owner Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Café Younes", num: 1 },
                { name: "T-Marbouta", num: 2 },
                { name: "Kalei Coffee", num: 3 },
                { name: "Café Prague", num: 4 },
                { name: "Tawlet", num: 5 },
                { name: "Urbanista", num: 6 },
              ].map((cafe) => (
                <button
                  key={cafe.num}
                  onClick={() =>
                    quickLogin(`cafe${cafe.num}@campus.com`, "cafe123")
                  }
                  className="p-2 bg-white hover:bg-green-50 border border-green-200 rounded text-left transition-all"
                >
                  <p className="text-xs font-medium text-gray-800">
                    {cafe.name}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    cafe{cafe.num}@...
                  </p>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              All cafes use password: <span className="font-mono">cafe123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
