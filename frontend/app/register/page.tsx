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
      setError("Passwords do not match!");
      return;
    }

    try {
      await registerUser(formData);
      alert("Account created successfully! You can now log in.");
      router.push('/login');
    } catch (err: any) {
      setError("Registration error. Make sure the email/username is not taken.");
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-2xl font-bold text-center">Registration</h1>
        
        {error && <div className="p-2 mb-4 text-sm text-red-600 bg-red-100 rounded">{error}</div>}

        <input 
          type="email" name="email" placeholder="Email" required
          className="block w-full p-2 mb-4 border rounded"
          onChange={handleChange} 
        />
        <input 
          type="text" name="username" placeholder="Username" required
          className="block w-full p-2 mb-4 border rounded"
          onChange={handleChange} 
        />
        <input 
          type="password" name="password" placeholder="Password" required
          className="block w-full p-2 mb-4 border rounded"
          onChange={handleChange} 
        />
        <input 
          type="password" name="password_confirm" placeholder="Repeat password" required
          className="block w-full p-4 mb-4 border rounded"
          onChange={handleChange} 
        />
        
        <button type="submit" className="w-full p-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
          Register
        </button>

        <div className="mt-4 text-sm text-center">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </div>
      </form>
    </div>
  );
}