import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Coffee,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    cafeName: "",
    cafeLocation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const user = await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.userType,
        formData.cafeName,
        formData.cafeLocation
      );

      // Redirect based on user type
      if (user.userType === "student") {
        navigate("/student/dashboard");
      } else if (user.userType === "cafe") {
        navigate("/cafe/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 bg-white rounded-full shadow-lg mb-4">
            <UserPlus className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-purple-100">Join the university discount system</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, userType: "student" })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.userType === "student"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <GraduationCap
                    className={`w-8 h-8 mx-auto mb-2 ${
                      formData.userType === "student"
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      formData.userType === "student"
                        ? "text-purple-600"
                        : "text-gray-600"
                    }`}
                  >
                    Student/Staff
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: "cafe" })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.userType === "cafe"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Coffee
                    className={`w-8 h-8 mx-auto mb-2 ${
                      formData.userType === "cafe"
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      formData.userType === "cafe"
                        ? "text-purple-600"
                        : "text-gray-600"
                    }`}
                  >
                    Cafe Owner
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {/* Cafe-specific fields */}
            {formData.userType === "cafe" && (
              <>
                <div className="pt-4 border-t border-purple-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Cafe Information
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="cafeName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Cafe Name
                      </label>
                      <input
                        id="cafeName"
                        name="cafeName"
                        type="text"
                        value={formData.cafeName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., Campus Coffee House"
                        required={formData.userType === "cafe"}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cafeLocation"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Cafe Location
                      </label>
                      <input
                        id="cafeLocation"
                        name="cafeLocation"
                        type="text"
                        value={formData.cafeLocation}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., Main Building, 1st Floor"
                        required={formData.userType === "cafe"}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
