'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';

interface DashboardStats {
  total_users: number;
  total_teams: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/teams/stats/`);
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error("Błąd pobierania statystyk");
        }
      } catch (error) {
        console.error("Wystąpił błąd sieci:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full">
      
      {/* Nagłówek Dashboardu */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Główny</h1>
        <p className="text-gray-500">Witaj w centrum dowodzenia aplikacji Teamworking.</p>
      </div>

      {/* Stan ładowania */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="bg-gray-100 rounded-2xl h-40 w-full"></div>
          <div className="bg-gray-100 rounded-2xl h-40 w-full"></div>
        </div>
      ) : (
        /* Główne Kafelki ze Statystykami */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kafelek 1: Użytkownicy */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Zarejestrowani Użytkownicy
              </p>
              <h2 className="text-5xl font-extrabold text-blue-600">
                {stats?.total_users || 0}
              </h2>
            </div>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl">
              👥
            </div>
          </div>

          {/* Kafelek 2: Zespoły */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Utworzone Zespoły
              </p>
              <h2 className="text-5xl font-extrabold text-emerald-500">
                {stats?.total_teams || 0}
              </h2>
            </div>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl">
              🚀
            </div>
          </div>

        </div>
      )}

    </div>
  );
}