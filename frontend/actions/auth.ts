// actions/auth.ts
'use server'

import { cookies } from 'next/headers';
import { LoginCredentials, DjangoTokenResponse } from '@/types/auth';

export async function loginUser(credentials: LoginCredentials) {
  try {
    const API_URL = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000/api/v1/auth/login/';

    // 1. Wysłanie zapytania do endpointu Django (np. SimpleJWT)
    const response = await fetch(`${API_URL}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Zależnie od konfiguracji Django, możesz musieć wysłać { username, password }
      body: JSON.stringify(credentials), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Django często zwraca błąd w polu 'detail'
      throw new Error(errorData.detail || 'Nieprawidłowe dane logowania');
    }

    // 2. Odbiór tokenów z Django
    const data: DjangoTokenResponse = await response.json();

    // 3. Zapisanie tokenów w bezpiecznych ciasteczkach
    const cookieStore = await cookies();
    
    // Zapisujemy 'data.access' do ciasteczka 'accessToken'
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 5, // Domyślnie access token w Django żyje 5 minut!
    });

    if (data.refreshToken) {
      // Zapisujemy 'data.refresh' do ciasteczka 'refreshToken'
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 1, // Domyślnie refresh token żyje 1 dzień
      });
    }

    return { success: true };
    
  } catch (error) {
    console.error('Błąd logowania Django:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Wystąpił błąd połączenia z serwerem' 
    };
  }
}