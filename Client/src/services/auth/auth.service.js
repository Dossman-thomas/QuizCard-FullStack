const BASE_URL = 'http://localhost:3001/api/auth'; // adjust if needed (e.g. http://localhost:5000/api/auth)

// register a new user
export const registerUser = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('registerUser error:', error);
    throw new Error('Network error during registration');
  }
};

// log in existing user
export const loginUser = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('loginUser error:', error);
    throw new Error('Network error during login');
  }
};
