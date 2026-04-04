'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTeamMembers, leaveTeam, getTeamChatHistory, deleteTeam, getMyUserId } from '@/lib/api';

type User = { id: number; username: string; email: string };
type Message = { sender_username: string; message: string; timestamp: string };

export default function TeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;
  const myUserId = getMyUserId();

  const [members, setMembers] = useState<User[]>([]);
  const [leaderId, setLeaderId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState<string>('');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!teamId) return;
    
    getTeamMembers(teamId)
      .then(data => {
        setMembers(data.members);
        setLeaderId(data.leader_id);
      })
      .catch(err => {
        console.error(err);
        alert("Brak dostępu lub zespół nie istnieje.");
        router.push('/team');
      });

    getTeamChatHistory(teamId)
      .then(data => setMessages(data))
      .catch(err => console.error("Nie udało się załadować historii", err));

    const token = localStorage.getItem('access');
    const socketUrl = `ws://localhost:8001/ws/chat/team/${teamId}/?token=${token}`;
    
    const socket = new WebSocket(socketUrl);
    ws.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      if (socket.readyState === WebSocket.CONNECTING) {
        socket.onopen = () => socket.close();
      } else if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [teamId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentText.trim() === '' || !ws.current) return;
    ws.current.send(JSON.stringify({ message: currentText }));
    setCurrentText('');
  };

  const handleLeaveTeam = async () => {
    if (members.length === 1) {
      if (!confirm("Jesteś jedynym członkiem tej grupy. Opuszczenie jej spowoduje jej całkowite i nieodwracalne usunięcie. Kontynuować?")) return;
      
      try {
        await deleteTeam(teamId); // Używamy API do usunięcia całej grupy
        router.push('/team');
      } catch (error) {
        alert("Błąd podczas usuwania zespołu.");
      }
    } 
    // SCENARIUSZ 2: W zespole są też inni ludzie
    else {
      if (!confirm("Czy na pewno chcesz opuścić ten zespół?")) return;
      
      try {
        await leaveTeam(teamId); // Używamy API do zwykłego wyjścia
        router.push('/team');
      } catch (error) {
        alert("Błąd podczas opuszczania zespołu.");
      }
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm("OSTRZEŻENIE: Całkowite usunięcie zespołu skasuje również jego historię czatu. Kontynuować?")) return;
    try {
      await deleteTeam(teamId);
      router.push('/team');
    } catch (error) {
      alert("Błąd. Tylko lider może usunąć zespół.");
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-xl border shadow-sm overflow-hidden">
      
      {/* HEADER ZESPOŁU */}
      <div className="flex justify-between items-center p-4 bg-slate-800 text-white">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/team')} className="text-sm text-slate-300 hover:text-white">
            &larr; Wróć
          </button>
          <h1 className="text-xl font-bold">Panel Zespołu #{teamId} {teamName}</h1>
        </div>
        
        {/* Menu "Trzy kropki" */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-slate-700 rounded-full font-bold">
            &#8942;
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-md shadow-xl border z-10 overflow-hidden">
              
              {/* Przycisk wychodzenia (dla każdego) */}
              <button 
                onClick={handleLeaveTeam}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 font-semibold border-b"
              >
                {members.length === 1 ? 'Opuść i usuń zespół' : 'Opuść zespół'}
              </button>

              {/* Przycisk usuwania (TYLKO DLA LIDERA) */}
              {myUserId === leaderId && members.length > 1 && (
                <button 
                  onClick={handleDeleteTeam}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-bold"
                >
                  Usuń zespół na zawsze
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEWA KOLUMNA: Czat Zespołowy */}
        <div className="w-3/4 flex flex-col border-r bg-gray-50">
          <div className="p-3 bg-white border-b font-semibold text-gray-600 text-sm">
            Czat Grupowy
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 mt-10">Brak nowych wiadomości. Napisz coś!</p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1 px-1 font-bold">
                  {msg.sender_username}
                </span>
                <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-white border text-gray-800 rounded-bl-none">
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-2">
            <input
              type="text"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Napisz do zespołu..."
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">
              Wyślij
            </button>
          </form>
        </div>

        {/* PRAWA KOLUMNA: Członkowie */}
        <div className="w-1/4 bg-white flex flex-col">
          <div className="p-3 bg-gray-100 border-b font-bold text-gray-700 text-sm text-center">
            Członkowie ({members.length})
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {members.map(user => (
              <div key={user.id} className="p-3 rounded-md hover:bg-gray-50 flex items-center justify-between border-b last:border-0">
                <div className="font-medium text-gray-800">{user.username}</div>
                {/* Znaczek lidera */}
                {user.id === leaderId && <span title="Lider" className="text-xl">👑</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}