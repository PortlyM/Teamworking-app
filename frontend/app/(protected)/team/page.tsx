'use client'

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTeams, createTeam } from '@/lib/api';

type Team = { id: number; name: string; leader: number };

export default function TeamsHubPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const fetchTeams = () => {
    getTeams()
      .then(data => setTeams(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    try {
      await createTeam(newTeamName);
      setNewTeamName('');
      setIsModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error(error);
      alert("Nie udało się stworzyć drużyny.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Moje Zespoły</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm"
        >
          + Stwórz nowy zespół
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length === 0 ? (
          <p className="text-gray-500 col-span-full">Nie należysz jeszcze do żadnego zespołu.</p>
        ) : (
          teams.map(team => (
            <div 
              key={team.id} 
              onClick={() => router.push(`/team/${team.id}`)}
              className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between h-32"
            >
              <h2 className="text-xl font-bold text-gray-800 truncate">{team.name}</h2>
              <span className="text-sm text-blue-600 font-medium">Wejdź do środka &rarr;</span>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Stwórz nowy zespół</h2>
            <form onSubmit={handleCreateTeam}>
              <input 
                type="text" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Nazwa zespołu..."
                className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold"
                >
                  Stwórz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}