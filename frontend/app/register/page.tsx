'use client';
import React, { useState } from 'react';
import { registerUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: ''
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirm) {
      setError("Hasła się nie zgadzają!");
      return;
    }

    try {
      await registerUser(formData);
      alert("Konto utworzone pomyślnie! Możesz się teraz zalogować.");
      router.push('/login');
    } catch (err: any) {
      setError("Błąd rejestracji. Upewnij się, że email/nazwa użytkownika nie są zajęte.");
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-2xl font-bold text-center">Rejestracja</h1>
        
        {error && <div className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

        <input 
          type="email" name="email" placeholder="Email" required
          className="block w-full p-2 mb-4 border rounded"
          onChange={handleChange} 
        />
        <input 
          type="text" name="username" placeholder="Nazwa użytkownika" required
          className="block w-full p-2 mb-4 border rounded"
          onChange={handleChange} 
        />
        <input 
          type="password" name="password" placeholder="Hasło" required
          className="block w-full p-2 mb-4 border rounded"
          onChange={handleChange} 
        />
        <input 
          type="password" name="password_confirm" placeholder="Powtórz hasło" required
          className="block w-full p-4 mb-4 border rounded"
          onChange={handleChange} 
        />
        
        <button type="submit" className="w-full p-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
          Zarejestruj się
        </button>

        <div className="mt-4 text-sm text-center">
          Masz już konto? <Link href="/login" className="text-blue-600 hover:underline">Zaloguj się</Link>
        </div>
      </form>
    </div>
  );
}