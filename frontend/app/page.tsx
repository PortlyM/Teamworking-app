import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- NAWIGACJA (NAVBAR) --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Teamworking App
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-blue-600 font-semibold transition-colors px-4 py-2"
            >
              Zaloguj się
            </Link>
            <Link 
              href="/register" 
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-sm"
            >
              Dołącz za darmo
            </Link>
          </div>
        </div>
      </nav>

      {/* --- SEKCJA HERO (GŁÓWNA) --- */}
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>

          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
            Start Communication <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Today.
            </span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed">
            Zbuduj swój wymarzony zespół, wymieniajcie się pomysłami na żywo i realizujcie wspólne cele szybciej niż kiedykolwiek. Wszystko w jednym, potężnym narzędziu.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Rozpocznij współpracę
            </Link>
            <Link 
              href="/login" 
              className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full text-lg font-bold hover:border-gray-300 transition-all w-full sm:w-auto"
            >
              Zaloguj się do panelu
            </Link>
          </div>
        </div>
      </main>

      {/* --- SEKCJA FUNKCJI (FEATURES) --- */}
      <section className="bg-gray-50 py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wszystko, czego potrzebuje Twój zespół</h2>
            <p className="text-gray-500">Zaprojektowane z myślą o maksymalnej produktywności.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Funkcja 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                👥
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zarządzanie Zespołami</h3>
              <p className="text-gray-500 leading-relaxed">
                Twórz dedykowane przestrzenie dla swoich projektów, zapraszaj współpracowników i swobodnie zarządzaj dostępami.
              </p>
            </div>

            {/* Funkcja 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                💬
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Czat Czasu Rzeczywistego</h3>
              <p className="text-gray-500 leading-relaxed">
                Koniec z opóźnieniami. Komunikuj się z zespołem na żywo dzięki błyskawicznym wiadomościom opartym na WebSocketach.
              </p>
            </div>

            {/* Funkcja 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                ✓
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wspólne Listy To-Do</h3>
              <p className="text-gray-500 leading-relaxed">
                Śledźcie postępy prac w jednym miejscu. Dodawaj zadania, odhaczaj zrealizowane cele i obserwuj, jak projekt rośnie.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- STOPKA (FOOTER) --- */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Teamworking App. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}