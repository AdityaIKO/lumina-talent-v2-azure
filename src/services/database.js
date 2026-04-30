/**
 * Lumina Talent Database Service
 * Handles communication with Azure Cosmos DB (MongoDB API)
 * 
 * NOTE: For production, browser-side direct DB connection is not possible.
 * This service should ideally call your Azure Functions backend.
 */

const COSMOS_ENDPOINT = import.meta.env.VITE_AZURE_COSMOS_ENDPOINT;
const COSMOS_KEY = import.meta.env.VITE_AZURE_COSMOS_KEY;

/**
 * [SECURITY WARNING]
 * Do not call MongoDB directly from the frontend in a production app.
 * Use Azure Functions or the Cosmos DB Data API.
 */

export const authenticateUser = async (email, password) => {
  console.log('[DB] Authenticating:', email);
  
  // MOCK IMPLEMENTATION (Simulating Backend Call)
  // In reality, you would call: fetch(`${COSMOS_ENDPOINT}/api/auth`, { ... })
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('lumina_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        resolve({ success: true, user });
      } else {
        reject(new Error('Email atau password salah.'));
      }
    }, 1000);
  });
};

export const registerNewUser = async (userData) => {
  console.log('[DB] Registering:', userData.email);
  
  // MOCK IMPLEMENTATION (Simulating Backend Call)
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('lumina_users') || '[]');
      // Use provided ID (Firebase UID) or fallback to timestamp
      const newUser = { 
        ...userData, 
        id: userData.id || Date.now().toString(), 
        createdAt: new Date().toISOString() 
      };
      users.push(newUser);
      localStorage.setItem('lumina_users', JSON.stringify(users));
      resolve({ success: true, user: newUser });
    }, 1000);
  });
};

export const getUserProfile = async (userId) => {
  console.log('[DB] Fetching Profile:', userId);
  
  // MOCK IMPLEMENTATION (Simulating Backend Call)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('lumina_users') || '[]');
      const user = users.find(u => u.id === userId);
      if (user) {
        resolve({ success: true, user });
      } else {
        reject(new Error('User tidak ditemukan.'));
      }
    }, 500);
  });
};

export const updateUserProfile = async (userId, profileData) => {
  console.log('[DB] Updating Profile:', userId, profileData);

  // Try to call real API if available
  const apiResult = await apiFetch(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(profileData)
  });

  if (apiResult) return apiResult;

  // Fallback to MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('lumina_users') || '[]');
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
        users[index] = { ...users[index], ...profileData, updatedAt: new Date().toISOString() };
        localStorage.setItem('lumina_users', JSON.stringify(users));
        resolve({ success: true, user: users[index] });
      } else {
        resolve({ success: false, message: 'User not found' });
      }
    }, 800);
  });
};

/**
 * [AZURE BRIDGE]
 * VITE_API_URL should be your deployed Azure Function URL (e.g., https://lumina-api.azurewebsites.net/api)
 * For local testing with Azure Functions Core Tools, use 'http://localhost:7071/api'.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'; 

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('[DB] API Fallback: Make sure Azure Functions are running.', err);
    return null;
  }
}
