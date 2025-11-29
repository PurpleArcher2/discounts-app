import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../utils/storage";

const DiscountManager = ({ cafeID, discounts = [], onDiscountsChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    percentage: "",
    description: "",
    validUntil: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDiscount) {
        // Update existing discount
        await updateDiscount(editingDiscount.discountID, formData);
      } else {
        // Create new discount with applicableFor parameter
        await createDiscount(
          cafeID,
          formData.percentage,
          formData.description,
          formData.validUntil,
          ["student", "staff"] // Added this parameter
        );
      }

      // Reset form
      setFormData({ percentage: "", description: "", validUntil: "" });
      setShowForm(false);
      setEditingDiscount(null);

      // Call the callback to refresh data
      if (typeof onDiscountsChange === "function") {
        onDiscountsChange();
      }
    } catch (error) {
      console.error("Failed to save discount:", error);
      alert("Failed to save discount. Please try again.");
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      percentage: discount.percentage,
      description: discount.description,
      validUntil: discount.validUntil.split("T")[0], // Format for date input
    });
    setShowForm(true);
  };

  const handleDelete = async (discountID) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        await deleteDiscount(discountID);
        if (typeof onDiscountsChange === "function") {
          onDiscountsChange();
        }
      } catch (error) {
        console.error("Failed to delete discount:", error);
        alert("Failed to delete discount. Please try again.");
      }
    }
  };

  const handleToggleActive = async (discount) => {
    try {
      await updateDiscount(discount.discountID, {
        isActive: !discount.isActive,
      });
      if (typeof onDiscountsChange === "function") {
        onDiscountsChange();
      }
    } catch (error) {
      console.error("Failed to toggle discount:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDiscount(null);
    setFormData({ percentage: "", description: "", validUntil: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Discount Management
          </h2>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Discount</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-200 animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingDiscount ? "Edit Discount" : "Create New Discount"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.percentage}
                onChange={(e) =>
                  setFormData({ ...formData, percentage: e.target.value })
                }
                className="input-field"
                placeholder="e.g., 15"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                placeholder="e.g., Student Special"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
                className="input-field"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 btn-primary">
                {editingDiscount ? "Update Discount" : "Create Discount"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discounts List */}
      <div className="space-y-3">
        {discounts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No discounts created yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Click "New Discount" to create one
            </p>
          </div>
        ) : (
          discounts.map((discount) => {
            const isExpired = new Date(discount.validUntil) < new Date();

            return (
              <div
                key={discount.discountID}
                className={`p-4 rounded-lg border-2 transition-all ${
                  discount.isActive && !isExpired
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-purple-600">
                        {discount.percentage}% OFF
                      </span>
                      {discount.isActive && !isExpired && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                      {isExpired && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium mb-1">
                      {discount.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Valid until:{" "}
                        {new Date(discount.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {!isExpired && (
                      <button
                        onClick={() => handleToggleActive(discount)}
                        className={`p-2 rounded-lg transition-all ${
                          discount.isActive
                            ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        title={discount.isActive ? "Deactivate" : "Activate"}
                      >
                        {discount.isActive ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(discount)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(discount.discountID)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DiscountManager;
