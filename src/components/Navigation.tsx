import { LayoutDashboard, Zap } from 'lucide-react';
import { clsx } from 'clsx';

type View = 'Inject' | 'Dashboard';

interface NavigationProps {
    currentView: View;
    onViewChange: (view: View) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-lg border-t border-white/5 p-4 z-50">
            <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                <button
                    onClick={() => onViewChange('Inject')}
                    className={clsx(
                        "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-300",
                        currentView === 'Inject'
                            ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(132,204,22,0.2)]"
                            : "text-white/40 hover:text-white/60 hover:bg-white/5"
                    )}
                >
                    <Zap size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Registro</span>
                </button>

                <button
                    onClick={() => onViewChange('Dashboard')}
                    className={clsx(
                        "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-300",
                        currentView === 'Dashboard'
                            ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(132,204,22,0.2)]"
                            : "text-white/40 hover:text-white/60 hover:bg-white/5"
                    )}
                >
                    <LayoutDashboard size={24} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Panel</span>
                </button>
            </div>
        </nav>
    );
}
