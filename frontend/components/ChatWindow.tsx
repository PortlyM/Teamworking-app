'use client';
import { useEffect, useState } from 'react';

export default function ChatWindow({ teamId }: { teamId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${teamId}/?token=${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    setSocket(ws);
    return () => ws.close();
  }, [teamId]);

  const sendMessage = () => {
    if (socket && input) {
      socket.send(JSON.stringify({ message: input }));
      setInput('');
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <div className="h-64 overflow-y-auto mb-4 bg-white p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold">{msg.user}: </span> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          value={input} onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border" placeholder="Napisz wiadomość..."
        />
        <button onClick={sendMessage} className="p-2 bg-green-500 text-white">Wyślij</button>
      </div>
    </div>
  );
}