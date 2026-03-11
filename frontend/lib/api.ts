const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ email, password }), 
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.log("Błąd z serwera:", errorData);
    throw new Error('Błąd logowania');
  }

  const data = await res.json();
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  return data;
};

export const registerUser = async (userData: any) => {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(JSON.stringify(errorData));
  }

  return await res.json();
};

export const logoutUser = async () => {
  const refresh = localStorage.getItem('refresh');
  const access = localStorage.getItem('access');

  if (refresh && access) {
    try {
      await fetch(`${API_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify({ refresh }),
      });
    } catch (error) {
      console.error("Błąd podczas wylogowywania na serwerze", error);
    }
  }

  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};