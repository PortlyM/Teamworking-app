'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTeams, createTeam, joinTeam } from '@/lib/api';

type Team = { id: number; name: string; leader: number; is_member: boolean };

export default function TeamsHubPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      
      // SZPIEG: Wyświetlamy w konsoli surowe dane z backendu
      console.log("Dane drużyn z backendu:", data); 

      const sortedTeams = data.sort((a: Team, b: Team) => 
        (a.is_member === b.is_member) ? 0 : a.is_member ? -1 : 1
      );
      setTeams([...sortedTeams]);
    } catch (err) {
      console.error(err);
    }
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
      fetchTeams(); // Odświeżamy listę, żeby nowy zespół się pojawił
    } catch (error) {
      alert("Błąd przy tworzeniu.");
    }
  };

  const handleJoinClick = async (teamId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await joinTeam(teamId);
      // Po udanym dołączeniu natychmiast odświeżamy listę z bazy
      await fetchTeams(); 
    } catch (error: any) {
      // Jeśli backend powie, że już jesteśmy, i tak odświeżamy listę
      await fetchTeams();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Centrum Zespołów</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all"
        >
          + Stwórz zespół
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
          <div 
            key={team.id} 
            onClick={() => team.is_member ? router.push(`/team/${team.id}`) : null}
            className={`relative p-6 rounded-2xl border transition-all flex flex-col justify-between h-40 ${
              team.is_member 
                ? 'bg-white border-blue-200 shadow-sm hover:shadow-lg cursor-pointer' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900 truncate pr-4">{team.name}</h2>
                <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-500 font-mono">
                  ID: {team.id}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {team.is_member ? 'Jesteś członkiem' : 'Zespół publiczny'}
              </p>
            </div>
            
            {team.is_member ? (
              <div className="flex items-center text-blue-600 font-bold text-sm">
                <span>Przejdź do zespołu</span>
                <span className="ml-2">&rarr;</span>
              </div>
            ) : (
              <button 
                onClick={(e) => handleJoinClick(team.id, e)}
                className="w-full bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm"
              >
                Dołącz do zespołu
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal - bez zmian */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Nowy zespół</h2>
            <form onSubmit={handleCreateTeam}>
              <input 
                type="text" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Jak nazwiecie swoją grupę?"
                className="w-full p-3 border-2 border-gray-100 rounded-xl mb-6 focus:border-blue-500 outline-none transition-colors"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-500 font-semibold">Anuluj</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Stwórz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}