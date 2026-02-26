interface DjangoTokenResponse {
  access: string;
  refresh: string;
}

export default async function TokenPage() {
  
  const credentials = {
    username: 'John@Pork1234',
    password: 'JestemJanek@Wieprz1234'
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      cache: 'no-store', 
    });

    if (!response.ok) {
      const errorData = await response.json();
      return (
        <div className="p-10">
          <h1 className="text-red-500 text-2xl font-bold">Błąd z Django!</h1>
          <pre className="bg-gray-100 p-4 mt-4 rounded text-black">
            {JSON.stringify(errorData, null, 2)}
          </pre>
        </div>
      );
    }

    const tokens: DjangoTokenResponse = await response.json();

    return (
      <div className="p-10 font-mono break-all text-black bg-white min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Sukces! Tokeny z Django:</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Access Token:</h2>
          <p className="text-sm text-gray-700">{tokens.access}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Refresh Token:</h2>
          <p className="text-sm text-gray-700">{tokens.refresh}</p>
        </div>
      </div>
    );

  } catch (error) {
    return (
      <div className="p-10">
        <h1 className="text-red-500 text-2xl font-bold">Błąd połączenia:</h1>
        <p>{String(error)}</p>
      </div>
    );
  }
}