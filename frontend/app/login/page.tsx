'use client';
import React from 'react';
import { useState } from 'react';
import { loginUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      router.push('/dashboard');
    } catch (err) {
      alert("Nieprawidłowe dane!");
      console.log(err)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 bg-gray-100 rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Zaloguj się</h1>
        <input 
          type="email" placeholder="Email" className="block w-full p-2 mb-4 border"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Hasło" className="block w-full p-2 mb-4 border"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded">Zaloguj</button>
      </form>
    </div>
  );
}