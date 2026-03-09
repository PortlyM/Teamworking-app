'use client';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/api';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <button 
      onClick={handleLogout} 
      className="px-4 py-2 font-bold text-white bg-red-600 rounded hover:bg-red-700"
    >
      Wyloguj się
    </button>
  );
}