const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// user api

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


// token api

import { jwtDecode } from "jwt-decode";

let refreshTokenPromise: Promise<string> | null = null;

async function getNewAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh');
  if (!refreshToken) throw new Error("Brak refresh tokenu w pamięci");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh token wygasł lub został odrzucony");

    const data = await response.json();
    localStorage.setItem('access', data.access);
    return data.access;
  } finally {
    refreshTokenPromise = null;
  }
}

export async function getValidToken(): Promise<string | null> {
  let token = localStorage.getItem('access');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime + 60) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = getNewAccessToken();
      }
      token = await refreshTokenPromise;
    }
    return token;
  } catch (error) {
    console.error("Błąd walidacji tokenu:", error);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return null;
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getValidToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    window.location.href = '/login';
    throw new Error("Brak autoryzacji");
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  }

  return response;
}


// chat api

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


// team api

export const getTeams = async () => {
  const res = await fetchWithAuth(`${API_URL}/teams/?t=${Date.now()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Błąd pobierania drużyn');
  return res.json();
};

export const createTeam = async (name: string) => {
  const res = await fetchWithAuth(`${API_URL}/teams/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Błąd tworzenia drużyny');
  return res.json();
};

export const getTeamMembers = async (teamId: number | string) => {
  const res = await fetchWithAuth(`${API_URL}/teams/${teamId}/members/`);
  if (!res.ok) throw new Error('Błąd pobierania członków drużyny');
  return res.json();
};

export const leaveTeam = async (teamId: number | string) => {
  const res = await fetchWithAuth(`${API_URL}/teams/${teamId}/leave/`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Błąd opuszczania drużyny');
  return res.json();
};

export const getTeamChatHistory = async (teamId: number | string) => {
  const res = await fetchWithAuth(`${API_URL}/teams/chat/history/team/${teamId}/`);
  if (!res.ok) throw new Error('Błąd pobierania historii czatu drużyny');
  return res.json();
};

export const joinTeam = async (teamId: number | string) => {
  const res = await fetchWithAuth(`${API_URL}/teams/${teamId}/join/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    console.error("Błąd z backendu:", errData);
    throw new Error(errData.detail || 'Błąd dołączania do drużyny');
  }
  return res.json();
};

export const deleteTeam = async (teamId: number | string) => {
  const res = await fetchWithAuth(`${API_URL}/teams/${teamId}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Błąd usuwania drużyny');
  return true;
};

export const getMyUserId = (): number | null => {
  const token = localStorage.getItem('access');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
  } catch (e) {
    return null;
  }
};


// task api

export const getTasks = async (teamId: string | number) => {
  const res = await fetchWithAuth(`${API_URL}/teams/${teamId}/tasks/`);
  if (!res.ok) throw new Error('Błąd pobierania zadań');
  return res.json();
};

export const createTask = async (teamId: string | number, title: string) => {
  const res = await fetchWithAuth(`${API_URL}/teams/${teamId}/tasks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Błąd tworzenia zadania');
  return res.json();
};

export const toggleTask = async (taskId: number, is_completed: boolean) => {
  const res = await fetchWithAuth(`${API_URL}/tasks/${taskId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_completed }),
  });
  if (!res.ok) throw new Error('Błąd aktualizacji zadania');
  return res.json();
};

export const deleteTask = async (taskId: number) => {
  const res = await fetchWithAuth(`${API_URL}/tasks/${taskId}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Błąd usuwania zadania');
  return true;
};