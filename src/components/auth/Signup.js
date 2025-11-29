import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Coffee,
  UserPlus,
  Mail,
  Lock,
  User,
  Upload,
  MapPin,
  AlertCircle,
  Briefcase,
} from "lucide-react";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    studentID: "",
    studentIDPhoto: "",
    staffID: "",
    staffIDPhoto: "",
    cafeName: "",
    cafeLocation: "",
    cafePhoto: "",
    cafeAddress: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result });
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (userType === "student" && !formData.studentID) {
      setError("Student ID is required");
      return;
    }

    if (userType === "student" && !formData.studentIDPhoto) {
      setError("Please upload your Student ID photo");
      return;
    }

    if (userType === "staff" && !formData.staffID) {
      setError("Staff ID is required");
      return;
    }

    if (userType === "staff" && !formData.staffIDPhoto) {
      setError("Please upload your Staff ID photo");
      return;
    }

    if (userType === "cafe" && !formData.cafeName) {
      setError("Cafe name is required");
      return;
    }

    if (userType === "cafe" && !formData.cafeLocation) {
      setError("Cafe location is required");
      return;
    }

    setLoading(true);

    try {
      // For staff, use the same fields as student but with staff data
      const idNumber =
        userType === "staff" ? formData.staffID : formData.studentID;
      const idPhoto =
        userType === "staff" ? formData.staffIDPhoto : formData.studentIDPhoto;

      await signup(
        formData.email,
        formData.password,
        formData.name,
        userType,
        idNumber,
        idPhoto,
        formData.cafeName,
        formData.cafeLocation,
        formData.cafePhoto,
        formData.cafeAddress
      );

      // Redirect based on user type
      if (userType === "student" || userType === "staff") {
        navigate("/pending-verification");
      } else if (userType === "cafe") {
        navigate("/pending-approval");
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Join our campus discount community</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setUserType("student")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === "student"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-800 text-sm">Student</p>
                <p className="text-xs text-gray-500 mt-1">Access discounts</p>
              </button>

              <button
                type="button"
                onClick={() => setUserType("staff")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === "staff"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium text-gray-800 text-sm">Staff</p>
                <p className="text-xs text-gray-500 mt-1">Access discounts</p>
              </button>

              <button
                type="button"
                onClick={() => setUserType("cafe")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  userType === "cafe"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Coffee className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium text-gray-800 text-sm">Cafe Owner</p>
                <p className="text-xs text-gray-500 mt-1">Offer discounts</p>
              </button>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Student-Specific Fields */}
            {userType === "student" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentID}
                    onChange={(e) =>
                      setFormData({ ...formData, studentID: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 2024123456"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Student ID Photo
                  </label>
                  <label className="cursor-pointer">
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-all flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">
                        {formData.studentIDPhoto
                          ? "Photo Uploaded ✓"
                          : "Click to Upload"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "studentIDPhoto")}
                      className="hidden"
                      required
                    />
                  </label>
                  {formData.studentIDPhoto && (
                    <img
                      src={formData.studentIDPhoto}
                      alt="Student ID"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </>
            )}

            {/* Staff-Specific Fields */}
            {userType === "staff" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff ID
                  </label>
                  <input
                    type="text"
                    value={formData.staffID}
                    onChange={(e) =>
                      setFormData({ ...formData, staffID: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., STAFF-2024-001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Staff ID Photo
                  </label>
                  <label className="cursor-pointer">
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-all flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">
                        {formData.staffIDPhoto
                          ? "Photo Uploaded ✓"
                          : "Click to Upload"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "staffIDPhoto")}
                      className="hidden"
                      required
                    />
                  </label>
                  {formData.staffIDPhoto && (
                    <img
                      src={formData.staffIDPhoto}
                      alt="Staff ID"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </>
            )}

            {/* Cafe-Specific Fields */}
            {userType === "cafe" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cafe Name
                  </label>
                  <input
                    type="text"
                    value={formData.cafeName}
                    onChange={(e) =>
                      setFormData({ ...formData, cafeName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="My Awesome Cafe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Location
                  </label>
                  <input
                    type="text"
                    value={formData.cafeLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cafeLocation: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Main Building, 1st Floor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.cafeAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cafeAddress: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="123 University Ave, City, State 12345"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Cafe Photo (Optional)
                  </label>
                  <label className="cursor-pointer">
                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-all flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">
                        {formData.cafePhoto
                          ? "Photo Uploaded ✓"
                          : "Click to Upload"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "cafePhoto")}
                      className="hidden"
                    />
                  </label>
                  {formData.cafePhoto && (
                    <img
                      src={formData.cafePhoto}
                      alt="Cafe"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-5 h-5" />
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
