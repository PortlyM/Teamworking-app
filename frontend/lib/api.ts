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

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem('access');

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    console.log("Token wygasł! Próbuję odświeżyć...");
    const refreshToken = localStorage.getItem('refresh');

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('access', data.access);
          token = data.access;

          response = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${token}`,
            },
          });
        } else {
          throw new Error("Refresh token wygasł");
        }
      } catch (error) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login'; 
        throw error;
      }
    } else {
      window.location.href = '/login';
    }
  }

  return response;
}

export const getUsers = async () => {
  const res = await fetchWithAuth(`${API_URL}/users/`);
  if (!res.ok) throw new Error('Błąd pobierania użytkowników');
  return res.json();
};

export const getChatHistory = async (targetId: number) => {
  const res = await fetchWithAuth(`${API_URL}/chat/history/private/${targetId}/`);
  if (!res.ok) throw new Error('Błąd pobierania historii czatu');
  return res.json();
};