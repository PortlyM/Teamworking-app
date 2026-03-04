'use client' // Ważne: teraz to komponent kliencki, żeby obsłużyć kliknięcie

import { useState } from 'react';
import { getDjangoTokens } from './actions';

export default function TokenPage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginAdress = 'http://127.0.0.1:8000/api/v1/auth/login/';
  const refreshAdress = 'http://127.0.0.1:8000/api/v1/auth/refresh/';

  const handleLogin = async () => {
    setIsLoading(true);
    const data = await getDjangoTokens({adress: loginAdress}); // Wywołujemy funkcję TYLKO RAZ tutaj
    setResult(data);
    setIsLoading(false);
  };

  return (
    <div className="p-10 font-sans bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tester Tokenów Django</h1>
      
      <button 
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isLoading ? 'Pobieranie...' : 'Pobierz Tokeny'}
      </button>

      <hr className="my-8 border-gray-200" />

      {/* Wyświetlanie błędu */}
      {result?.success === false && (
        <div className="bg-red-50 p-4 rounded border border-red-200">
          <h2 className="text-red-600 font-bold">Błąd z Django:</h2>
          <pre className="text-xs mt-2">{JSON.stringify(result.error, null, 2)}</pre>
        </div>
      )}

      {/* Wyświetlanie sukcesu */}
      {result?.success === true && (
        <div className="font-mono break-all">
          <h2 className="text-xl font-bold mb-4 text-green-600">Sukces!</h2>
          
          <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-300">
            <h3 className="font-bold mb-2">Access Token:</h3>
            <p className="text-sm text-gray-600">{result.tokens.access}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded border border-gray-300">
            <h3 className="font-bold mb-2">Refresh Token:</h3>
            <p className="text-sm text-gray-600">{result.tokens.refresh}</p>
          </div>
        </div>
      )}
    </div>
  );
}