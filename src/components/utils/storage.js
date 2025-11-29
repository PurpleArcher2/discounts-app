// Offline storage utility using localStorage
// Simulates real-time database behavior

const STORAGE_KEYS = {
  USERS: "discount_users",
  CAFES: "discount_cafes",
  DISCOUNTS: "discount_discounts",
  CURRENT_USER: "discount_current_user",
  INITIALIZED: "discount_initialized",
  PENDING_CAFES: "discount_pending_cafes",
};

// Initialize with empty data - NO DEFAULTS
// Create ONE admin account on first initialization
const initializeData = () => {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    return;
  }

  // Create admin user
  const adminUser = {
    userID: "admin_default",
    email: "admin@campus.com",
    password: "admin123", // Change this in production!
    name: "System Administrator",
    userType: "admin",
    cafeID: null,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.PENDING_CAFES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
};

// User Management
export const createUser = (
  email,
  password,
  name,
  userType,
  studentID = "",
  studentIDPhoto = "",
  cafeName = "",
  cafeLocation = "",
  cafePhoto = "",
  cafeAddress = ""
) => {
  initializeData();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");

  if (users.find((u) => u.email === email)) {
    throw new Error("User already exists");
  }

  const newUser = {
    userID: `user_${Date.now()}`,
    email,
    password,
    name,
    userType,
    cafeID: null,
    studentID: studentID || null,
    studentIDPhoto: studentIDPhoto || null,
    verified: userType === "student" || userType === "staff" ? false : null, // Students and staff need verification
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // If user is a cafe owner, create a PENDING cafe request
  if (userType === "cafe") {
    createPendingCafe(
      newUser.userID,
      cafeName || name,
      cafeLocation,
      cafePhoto,
      cafeAddress
    );
  }

  return { ...newUser, password: undefined };
};

export const loginUser = (email, password) => {
  initializeData();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const userWithoutPassword = { ...user, password: undefined };
  localStorage.setItem(
    STORAGE_KEYS.CURRENT_USER,
    JSON.stringify(userWithoutPassword)
  );

  return userWithoutPassword;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getAllUsers = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
};

export const verifyStudent = (userID) => {
  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.userID === userID);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  users[userIndex].verified = true;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  return users[userIndex];
};

export const rejectStudent = (userID) => {
  const users = getAllUsers();
  const filteredUsers = users.filter((u) => u.userID !== userID);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
};

// Pending Cafe Management
export const createPendingCafe = (
  userID,
  cafeName,
  cafeLocation,
  cafePhoto,
  cafeAddress
) => {
  const pendingCafes = getPendingCafes();

  const newPendingCafe = {
    pendingID: `pending_${Date.now()}`,
    userID,
    name: cafeName,
    photo: cafePhoto,
    location: cafeLocation,
    address: cafeAddress,
    status: "pending", // pending, approved, rejected
    createdAt: new Date().toISOString(),
  };

  pendingCafes.push(newPendingCafe);
  localStorage.setItem(
    STORAGE_KEYS.PENDING_CAFES,
    JSON.stringify(pendingCafes)
  );

  return newPendingCafe;
};

export const getPendingCafes = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_CAFES) || "[]");
};

export const approveCafe = (pendingID) => {
  const pendingCafes = getPendingCafes();
  const cafeIndex = pendingCafes.findIndex((c) => c.pendingID === pendingID);

  if (cafeIndex === -1) {
    throw new Error("Pending cafe not found");
  }

  const pendingCafe = pendingCafes[cafeIndex];

  // Create actual cafe
  const cafeID = `cafe_${Date.now()}`;
  const newCafe = {
    cafeID,
    name: pendingCafe.name,
    photo: pendingCafe.photo,
    location: pendingCafe.location,
    address: pendingCafe.address,
    lat: null,
    lng: null,
    currentMood: "Calm",
    ownerID: pendingCafe.userID,
    createdAt: new Date().toISOString(),
  };

  // Add to cafes
  const cafes = getAllCafes();
  cafes.push(newCafe);
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(cafes));

  // Update user with cafe ID
  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.userID === pendingCafe.userID);
  if (userIndex !== -1) {
    users[userIndex].cafeID = cafeID;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Remove from pending
  pendingCafes.splice(cafeIndex, 1);
  localStorage.setItem(
    STORAGE_KEYS.PENDING_CAFES,
    JSON.stringify(pendingCafes)
  );

  return newCafe;
};

export const rejectCafe = (pendingID, reason = "") => {
  const pendingCafes = getPendingCafes();
  const filteredCafes = pendingCafes.filter((c) => c.pendingID !== pendingID);
  localStorage.setItem(
    STORAGE_KEYS.PENDING_CAFES,
    JSON.stringify(filteredCafes)
  );
};

export const getCafePendingStatus = (userID) => {
  const pendingCafes = getPendingCafes();
  return pendingCafes.find((c) => c.userID === userID);
};

// Cafe Management
export const getAllCafes = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAFES) || "[]");
};

export const getCafeById = (cafeID) => {
  const cafes = getAllCafes();
  return cafes.find((c) => c.cafeID === cafeID);
};

export const updateCafeMood = (cafeID, mood) => {
  const cafes = getAllCafes();
  const cafeIndex = cafes.findIndex((c) => c.cafeID === cafeID);

  if (cafeIndex === -1) {
    throw new Error("Cafe not found");
  }

  cafes[cafeIndex].currentMood = mood;
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(cafes));

  return cafes[cafeIndex];
};

export const updateCafeDetails = (cafeID, updates) => {
  const cafes = getAllCafes();
  const cafeIndex = cafes.findIndex((c) => c.cafeID === cafeID);

  if (cafeIndex === -1) {
    throw new Error("Cafe not found");
  }

  cafes[cafeIndex] = { ...cafes[cafeIndex], ...updates };
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(cafes));

  return cafes[cafeIndex];
};

// Discount Management - UPDATED to support user types
export const getAllDiscounts = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISCOUNTS) || "[]");
};

export const getDiscountsByCafe = (cafeID) => {
  const discounts = getAllDiscounts();
  return discounts.filter((d) => d.cafeID === cafeID);
};

export const createDiscount = (
  cafeID,
  percentage,
  description,
  validUntil,
  applicableFor = ["student", "staff"] // NEW: which user types can use this discount
) => {
  const discounts = getAllDiscounts();

  const newDiscount = {
    discountID: `disc_${Date.now()}`,
    cafeID,
    percentage: parseInt(percentage),
    description,
    validUntil,
    applicableFor: Array.isArray(applicableFor)
      ? applicableFor
      : [applicableFor], // Ensure it's an array
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  discounts.push(newDiscount);
  localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(discounts));

  return newDiscount;
};

export const updateDiscount = (discountID, updates) => {
  const discounts = getAllDiscounts();
  const discountIndex = discounts.findIndex((d) => d.discountID === discountID);

  if (discountIndex === -1) {
    throw new Error("Discount not found");
  }

  // Ensure applicableFor is always an array
  if (updates.applicableFor && !Array.isArray(updates.applicableFor)) {
    updates.applicableFor = [updates.applicableFor];
  }

  discounts[discountIndex] = { ...discounts[discountIndex], ...updates };
  localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(discounts));

  return discounts[discountIndex];
};

export const deleteDiscount = (discountID) => {
  const discounts = getAllDiscounts();
  const filteredDiscounts = discounts.filter(
    (d) => d.discountID !== discountID
  );

  localStorage.setItem(
    STORAGE_KEYS.DISCOUNTS,
    JSON.stringify(filteredDiscounts)
  );
};

// NEW: Get active discount for cafe based on user type
export const getActiveDiscountForCafe = (cafeID, userType = null) => {
  const discounts = getDiscountsByCafe(cafeID);
  const now = new Date();

  const activeDiscounts = discounts.filter(
    (d) => d.isActive && new Date(d.validUntil) > now
  );

  // If userType is provided, filter by applicable user types
  if (userType) {
    return activeDiscounts.find(
      (d) => d.applicableFor && d.applicableFor.includes(userType)
    );
  }

  // Otherwise return any active discount
  return activeDiscounts[0] || null;
};

// NEW: Check if cafe has any active discounts (regardless of user type)
export const cafeHasActiveDiscounts = (cafeID) => {
  const discounts = getDiscountsByCafe(cafeID);
  const now = new Date();

  return discounts.some((d) => d.isActive && new Date(d.validUntil) > now);
};

// Real-time simulation
export const subscribeToChanges = (callback) => {
  const interval = setInterval(() => {
    callback();
  }, 2000);

  return () => clearInterval(interval);
};

// Utility function to reset all data
export const resetDatabase = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  initializeData();
};

// Initialize on import
initializeData();
