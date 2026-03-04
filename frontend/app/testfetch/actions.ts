'use server'

interface GetAdressProps {
  adress: string;
}

export async function getDjangoTokens({adress}: GetAdressProps) {
  const credentials = {
    username: 'John@Pork1234',
    password: 'JestemJanek@Wieprz1234'
  };

  const refreshcredential = {
    refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3MjYxMzY1MywiaWF0IjoxNzcyNTI3MjUzLCJqdGkiOiI4YzM5ZTI0ZjRkMWM0ZDhmYjlhNTYyNTY5OTg2NTA5NCIsInVzZXJfaWQiOiIyIn0.cQkM0FFfR8UYpPJwEkN0buIQPJbjUY_JZAN4priMgIU'
  };

  try {
    const response = await fetch(adress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      cache: 'no-store', 
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data };
    }

    return { success: true, tokens: data };

  } catch (error) {
    return { success: false, error: "Błąd połączenia z serwerem Django" };
  }
}