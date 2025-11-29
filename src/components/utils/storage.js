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

// Initialize with fixed demo accounts and Lebanese cafes
const initializeData = () => {
  if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    return;
  }

  // Create fixed demo accounts
  const demoUsers = [
    {
      userID: "admin_default",
      email: "admin@campus.com",
      password: "admin123",
      name: "System Administrator",
      userType: "admin",
      cafeID: null,
      createdAt: new Date().toISOString(),
    },
    {
      userID: "student_demo",
      email: "student@campus.com",
      password: "student123",
      name: "Ahmad Hassan",
      userType: "student",
      cafeID: null,
      studentID: "STU2024001",
      studentIDPhoto: null,
      verified: true,
      createdAt: new Date().toISOString(),
    },
    {
      userID: "staff_demo",
      email: "staff@campus.com",
      password: "staff123",
      name: "Layla Khoury",
      userType: "staff",
      cafeID: null,
      verified: true,
      createdAt: new Date().toISOString(),
    },
  ];

  // Lebanese cafes with owners and real images
  const lebaneseCafes = [
    {
      cafeID: "cafe_1",
      name: "Café Younes",
      photo:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
      location: "Hamra, Beirut",
      address: "Hamra Street, Beirut, Lebanon",
      lat: null,
      lng: null,
      currentMood: "Calm",
      ownerID: "owner_1",
      createdAt: new Date().toISOString(),
    },
    {
      cafeID: "cafe_2",
      name: "T-Marbouta",
      photo:
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80",
      location: "Mar Mikhael, Beirut",
      address: "Mar Mikhael, Beirut, Lebanon",
      lat: null,
      lng: null,
      currentMood: "Moderate",
      ownerID: "owner_2",
      createdAt: new Date().toISOString(),
    },
    {
      cafeID: "cafe_3",
      name: "Kalei Coffee Co.",
      photo:
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80",
      location: "Saifi Village, Beirut",
      address: "Saifi Village, Beirut, Lebanon",
      lat: null,
      lng: null,
      currentMood: "Crowded",
      ownerID: "owner_3",
      createdAt: new Date().toISOString(),
    },
    {
      cafeID: "cafe_4",
      name: "Café de Prague",
      photo:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
      location: "Achrafieh, Beirut",
      address: "Achrafieh, Beirut, Lebanon",
      lat: null,
      lng: null,
      currentMood: "Calm",
      ownerID: "owner_4",
      createdAt: new Date().toISOString(),
    },
    {
      cafeID: "cafe_5",
      name: "Tawlet",
      photo:
        "https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800&q=80",
      location: "Mar Mikhael, Beirut",
      address: "Mar Mikhael, Beirut, Lebanon",
      lat: null,
      lng: null,
      currentMood: "Moderate",
      ownerID: "owner_5",
      createdAt: new Date().toISOString(),
    },
    {
      cafeID: "cafe_6",
      name: "Urbanista",
      photo:
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",
      location: "Gemmayze, Beirut",
      address: "Gemmayze, Beirut, Lebanon",
      lat: null,
      lng: null,
      currentMood: "Crowded",
      ownerID: "owner_6",
      createdAt: new Date().toISOString(),
    },
  ];

  // Cafe owners
  const cafeOwners = [
    {
      userID: "owner_1",
      email: "cafe1@campus.com",
      password: "cafe123",
      name: "Café Younes Manager",
      userType: "cafe",
      cafeID: "cafe_1",
      createdAt: new Date().toISOString(),
    },
    {
      userID: "owner_2",
      email: "cafe2@campus.com",
      password: "cafe123",
      name: "T-Marbouta Manager",
      userType: "cafe",
      cafeID: "cafe_2",
      createdAt: new Date().toISOString(),
    },
    {
      userID: "owner_3",
      email: "cafe3@campus.com",
      password: "cafe123",
      name: "Kalei Coffee Manager",
      userType: "cafe",
      cafeID: "cafe_3",
      createdAt: new Date().toISOString(),
    },
    {
      userID: "owner_4",
      email: "cafe4@campus.com",
      password: "cafe123",
      name: "Café de Prague Manager",
      userType: "cafe",
      cafeID: "cafe_4",
      createdAt: new Date().toISOString(),
    },
    {
      userID: "owner_5",
      email: "cafe5@campus.com",
      password: "cafe123",
      name: "Tawlet Manager",
      userType: "cafe",
      cafeID: "cafe_5",
      createdAt: new Date().toISOString(),
    },
    {
      userID: "owner_6",
      email: "cafe6@campus.com",
      password: "cafe123",
      name: "Urbanista Manager",
      userType: "cafe",
      cafeID: "cafe_6",
      createdAt: new Date().toISOString(),
    },
  ];

  // Sample discounts for some cafes
  const sampleDiscounts = [
    {
      discountID: "disc_1",
      cafeID: "cafe_1",
      percentage: 20,
      description: "Student Special",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicableFor: ["student"],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      discountID: "disc_2",
      cafeID: "cafe_2",
      percentage: 15,
      description: "Staff Discount",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicableFor: ["staff"],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      discountID: "disc_3",
      cafeID: "cafe_3",
      percentage: 25,
      description: "Campus Community Deal",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicableFor: ["student", "staff"],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  // Combine all users
  const allUsers = [...demoUsers, ...cafeOwners];

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(lebaneseCafes));
  localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(sampleDiscounts));
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
    verified: userType === "student" || userType === "staff" ? false : null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

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
    status: "pending",
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

  const cafes = getAllCafes();
  cafes.push(newCafe);
  localStorage.setItem(STORAGE_KEYS.CAFES, JSON.stringify(cafes));

  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.userID === pendingCafe.userID);
  if (userIndex !== -1) {
    users[userIndex].cafeID = cafeID;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

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

// Discount Management
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
  applicableFor = ["student", "staff"]
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
      : [applicableFor],
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

export const getActiveDiscountForCafe = (cafeID, userType = null) => {
  const discounts = getDiscountsByCafe(cafeID);
  const now = new Date();

  const activeDiscounts = discounts.filter(
    (d) => d.isActive && new Date(d.validUntil) > now
  );

  if (userType) {
    return activeDiscounts.find(
      (d) => d.applicableFor && d.applicableFor.includes(userType)
    );
  }

  return activeDiscounts[0] || null;
};

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
