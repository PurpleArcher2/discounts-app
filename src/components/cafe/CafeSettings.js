import React, { useState } from "react";
import { Settings, Upload, MapPin, Image as ImageIcon } from "lucide-react";
import { updateCafeDetails } from "../utils/storage";

const CafeSettings = ({ cafe, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    photo: "",
  });
  const [uploading, setUploading] = useState(false);

  // Update form data when cafe prop changes
  React.useEffect(() => {
    if (cafe) {
      setFormData({
        name: cafe.name || "",
        location: cafe.location || "",
        address: cafe.address || "",
        photo: cafe.photo || "",
      });
    }
  }, [cafe]);

  // Show loading state if cafe is not yet loaded
  if (!cafe) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Cafe Settings</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading cafe information...</p>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setUploading(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
        setUploading(false);
      };

      reader.onerror = () => {
        alert("Failed to read image file");
        setUploading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCafeDetails(cafe.cafeID, formData);
      onUpdate();
      alert("Cafe details updated successfully!");
    } catch (error) {
      console.error("Failed to update cafe:", error);
      alert("Failed to update cafe details. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Cafe Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cafe Photo
          </label>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Cafe preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended: 800x600px, max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Cafe Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cafe Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Short Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Main Building, 1st Floor"
            required
          />
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Address (for Google Maps)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 123 University Ave, City, State 12345"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This will be used to show your location on Google Maps
          </p>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default CafeSettings;
