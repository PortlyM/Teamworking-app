'use client';

import { useEffect, useState, useRef } from 'react';
import { getUsers, getChatHistory } from '@/lib/api';

type User = { id: number; username: string; email: string };
type Message = { id?: number; sender_id: number; message: string; timestamp: string };

export default function ChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentText, setCurrentText] = useState('');
  
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUsers()
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    getChatHistory(selectedUser.id)
      .then(data => setMessages(data))
      .catch(err => console.error(err));

    const token = localStorage.getItem('access');
    const socketUrl = `ws://localhost:8001/ws/chat/private/${selectedUser.id}/?token=${token}`;
    
    ws.current = new WebSocket(socketUrl);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      ws.current?.close();
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentText.trim() === '' || !ws.current) return;

    ws.current.send(JSON.stringify({ message: currentText }));
    setCurrentText('');
  };

  const isMyMessage = (senderId: number) => selectedUser && senderId !== selectedUser.id;

  return (
    <div className="flex h-[80vh] overflow-hidden bg-white border rounded-lg shadow-sm">
      
      <div className="w-1/3 bg-gray-50 border-r flex flex-col">
        <div className="p-4 bg-gray-100 border-b font-bold text-gray-700">
          Użytkownicy
        </div>
        <div className="overflow-y-auto flex-1">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`w-full text-left p-4 border-b hover:bg-blue-50 transition-colors ${
                selectedUser?.id === u.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="font-semibold">{u.username}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-white">
        {selectedUser ? (
          <>
            <div className="p-4 border-b bg-white font-bold text-lg">
              Czat z: <span className="text-blue-600">{selectedUser.username}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => {
                const isMine = isMyMessage(msg.sender_id);
                
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-xs text-gray-500 mb-1 px-1">
                      {isMine ? 'Ja' : selectedUser.username}
                    </span>
                    
                    <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      isMine 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-2">
              <input
                type="text"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Napisz wiadomość..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
              >
                Wyślij
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Wybierz użytkownika z listy po lewej, aby rozpocząć rozmowę.
          </div>
        )}
      </div>

    </div>
  );
}