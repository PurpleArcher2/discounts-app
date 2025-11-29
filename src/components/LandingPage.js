import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Coffee,
  Users,
  Briefcase,
  TrendingDown,
  MapPin,
  ArrowRight,
  Shield,
  Zap,
  Heart,
} from "lucide-react";
// Import your logo - make sure to add it to src/assets/
import budgetBuddyLogo from "../assets/budget-buddy-logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: "Exclusive Discounts",
      description:
        "Save money at your favorite campus cafes with exclusive student and staff discounts",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Easy to Find",
      description:
        "Discover nearby cafes with active discounts using our interactive map",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Users",
      description:
        "Secure platform with verified student and staff accounts for authentic savings",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Access",
      description:
        "Show your QR code and enjoy instant discounts at participating cafes",
    },
  ];

  const userTypes = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Students",
      description:
        "Access exclusive discounts and save on your daily coffee runs",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Staff",
      description: "Enjoy special staff discounts at campus cafes and save big",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Coffee className="w-12 h-12" />,
      title: "Cafe Owners",
      description:
        "Attract more customers by offering targeted student and staff discounts",
      color: "from-teal-500 to-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Header Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20">
                <img
                  src={budgetBuddyLogo}
                  alt="Budget Buddy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Budget Buddy
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Your Campus Discount Companion
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          {/* Main Hero Logo */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <img
              src={budgetBuddyLogo}
              alt="Budget Buddy"
              className="relative w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Your Guide to
            <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Local Discounts
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
            Discover exclusive discounts at campus cafes. Whether you're a
            student, staff member, or cafe owner, Budget Buddy connects you to
            savings!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:shadow-xl transition-all font-bold text-lg border-2 border-gray-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Budget Buddy?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The smartest way to save money on campus
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Perfect For Everyone
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're saving or offering discounts, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {userTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white mx-auto`}
                >
                  {type.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {type.title}
                </h4>
                <p className="text-gray-600 text-center mb-6">
                  {type.description}
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className={`w-full px-6 py-3 bg-gradient-to-r ${type.color} text-white rounded-xl hover:shadow-lg transition-all font-medium`}
                >
                  Join Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center text-white">
              <div className="text-4xl sm:text-5xl font-bold mb-2">500+</div>
              <div className="text-emerald-100 text-sm sm:text-base">
                Active Students
              </div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl sm:text-5xl font-bold mb-2">50+</div>
              <div className="text-green-100 text-sm sm:text-base">
                Campus Cafes
              </div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl sm:text-5xl font-bold mb-2">$10K+</div>
              <div className="text-teal-100 text-sm sm:text-base">
                Total Savings
              </div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl sm:text-5xl font-bold mb-2">30%</div>
              <div className="text-emerald-100 text-sm sm:text-base">
                Avg. Discount
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mx-auto mb-6" />
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Saving?
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Join hundreds of students and staff already saving money every day
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg sm:text-xl"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Footer Logo */}
              <div className="w-14 h-14">
                <img
                  src={budgetBuddyLogo}
                  alt="Budget Buddy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-lg">Budget Buddy</div>
                <div className="text-sm text-gray-400">
                  Save Smart, Spend Less
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 Budget Buddy. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with <Heart className="w-3 h-3 inline text-emerald-500" />{" "}
                for campus communities
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
