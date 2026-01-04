import { useState } from 'react';
import { Header } from './components/Header';
import { ExpenseForm } from './components/ExpenseForm';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';

type View = 'Inject' | 'Dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('Inject');

  return (
    <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-20">
      <Header />
      <main className="pt-24 px-4 pb-8 max-w-md mx-auto w-full flex flex-col gap-6">
        {currentView === 'Inject' ? <ExpenseForm /> : <Dashboard />}
      </main>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}

export default App;
