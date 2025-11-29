// Offline storage utility using localStorage
// Simulates real-time database behavior

const STORAGE_KEYS = {
  USERS: "discount_users",
  CAFES: "discount_cafes",
  DISCOUNTS: "discount_discounts",
  CURRENT_USER: "discount_current_user",
  INITIALIZED: "discount_initialized",
};

// Initialize default data ONLY ONCE
const initializeData = () => {
  // Check if already initialized to prevent overwriting user data
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    return;
  }

  // Create default users
  const defaultUsers = [
    {
      userID: "user_student_demo",
      email: "student@university.edu",
      password: "password123",
      name: "Demo Student",
      userType: "student",
      cafeID: null,
      createdAt: new Date().toISOString(),
    },
    {
      userID: "user_cafe_demo",
      email: "cafe@campus.com",
      password: "password123",
      name: "Campus Coffee Manager",
      userType: "cafe",
      cafeID: "cafe1",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));

  // Create default cafes
  const defaultCafes = [
    {
      cafeID: "cafe1",
      name: "Campus Coffee Manager's Cafe",
      logo: "☕",
      location: "Main Building, 1st Floor",
      currentMood: "Calm",
      ownerID: "user_cafe_demo",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(defaultCafes));

  // Create ONLY discounts for the demo cafe owner's cafe
  const defaultDiscounts = [
    {
      discountID: "disc1",
      cafeID: "cafe1",
      percentage: 15,
      description: "Student Special",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      discountID: "disc2",
      cafeID: "cafe1",
      percentage: 20,
      description: "Morning Rush Deal",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(
    STORAGE_KEYS.DISCOUNTS,
    JSON.stringify(defaultDiscounts)
  );

  // Mark as initialized
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
};

// User Management
export const createUser = (
  email,
  password,
  name,
  userType,
  cafeName = "",
  cafeLocation = ""
) => {
  initializeData();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    throw new Error("User already exists");
  }

  const newUser = {
    userID: `user_${Date.now()}`,
    email,
    password, // In production, this should be hashed
    name,
    userType, // 'student' or 'cafe'
    cafeID: null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // If user is a cafe owner, create a new cafe for them
  if (userType === "cafe") {
    const cafeID = `cafe_${Date.now()}`;
    const newCafe = createCafeForUser(
      newUser.userID,
      cafeID,
      cafeName || name,
      cafeLocation
    );

    // Update user with their cafe ID
    newUser.cafeID = cafeID;
    const updatedUsers = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USERS) || "[]"
    );
    const userIndex = updatedUsers.findIndex(
      (u) => u.userID === newUser.userID
    );
    if (userIndex !== -1) {
      updatedUsers[userIndex].cafeID = cafeID;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    }
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

export const assignCafeToUser = (userID, cafeID) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
  const userIndex = users.findIndex((u) => u.userID === userID);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  users[userIndex].cafeID = cafeID;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const cafes = getAllCafes();
  const cafeIndex = cafes.findIndex((c) => c.cafeID === cafeID);
  if (cafeIndex !== -1) {
    cafes[cafeIndex].ownerID = userID;
    localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(cafes));
  }
};

// Create a new cafe for a user
export const createCafeForUser = (
  userID,
  cafeID,
  cafeName,
  cafeLocation = ""
) => {
  const cafes = getAllCafes();

  // Generate a random emoji for the cafe logo
  const cafeEmojis = [
    "☕",
    "🍵",
    "🧋",
    "🥤",
    "🍰",
    "🧁",
    "🥐",
    "🍪",
    "🍩",
    "🥯",
  ];
  const randomEmoji = cafeEmojis[Math.floor(Math.random() * cafeEmojis.length)];

  // Default location if not provided
  const locations = [
    "Main Building, Ground Floor",
    "Library Building, 2nd Floor",
    "Student Center, East Wing",
    "Science Block, Cafeteria",
    "Arts Building, Lobby",
    "Engineering Wing, 1st Floor",
    "Medical Campus, Ground Floor",
    "Sports Complex, Ground Floor",
  ];
  const defaultLocation =
    cafeLocation || locations[Math.floor(Math.random() * locations.length)];

  const newCafe = {
    cafeID,
    name: cafeName,
    logo: randomEmoji,
    location: defaultLocation,
    currentMood: "Calm",
    ownerID: userID,
    createdAt: new Date().toISOString(),
  };

  cafes.push(newCafe);
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(cafes));

  return newCafe;
};

// Discount Management
export const getAllDiscounts = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DISCOUNTS) || "[]");
};

export const getDiscountsByCafe = (cafeID) => {
  const discounts = getAllDiscounts();
  return discounts.filter((d) => d.cafeID === cafeID);
};

export const createDiscount = (cafeID, percentage, description, validUntil) => {
  const discounts = getAllDiscounts();

  const newDiscount = {
    discountID: `disc_${Date.now()}`,
    cafeID,
    percentage: parseInt(percentage),
    description,
    validUntil,
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

export const getActiveDiscountForCafe = (cafeID) => {
  const discounts = getDiscountsByCafe(cafeID);
  const now = new Date();

  return discounts.find((d) => d.isActive && new Date(d.validUntil) > now);
};

// Real-time simulation (for demo purposes)
export const subscribeToChanges = (callback) => {
  // Simulate real-time updates by polling every 2 seconds
  const interval = setInterval(() => {
    callback();
  }, 2000);

  return () => clearInterval(interval);
};

// Utility function to reset all data (useful for testing)
export const resetDatabase = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  initializeData();
};

// Initialize on import
initializeData();
