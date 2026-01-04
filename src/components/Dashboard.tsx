
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { AlertCircle, Loader2, TrendingUp, Wallet, AlertTriangle, CheckCircle2, History, Trash2 } from 'lucide-react';

interface Transaction {
    id: number | string;
    concepto: string;
    cantidad: number;
    pagador: string;
    categoria: string;
    fecha: string;
}

interface DashboardData {
    total_budget: number;
    total_spent: number;
    remaining: number;
    percentage: number;
    status: 'VERDE' | 'AMARILLO' | 'ROJO';
    message: string;
    transactions?: Transaction[];
}

export function Dashboard() {
    // Use DashboardData directly as the state type (flat structure)
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('https://n8n-motor.onrender.com/webhook/equity-hub-stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            const json = await response.json();
            // Set json directly (it has the flat structure)
            setData(json);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id: number | string) => {
        if (!window.confirm('¿Seguro que quieres borrar este gasto?')) return;

        try {
            const response = await fetch('https://n8n-motor.onrender.com/webhook/delete-expense', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error('Failed to delete expense');

            // Refresh stats to show updated list
            fetchStats();
        } catch (err) {
            console.error('Error deleting expense:', err);
            alert('Error al borrar el gasto. Por favor, inténtalo de nuevo.');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-primary space-y-4">
                <Loader2 className="animate-spin" size={48} />
                <p className="text-white/50 tracking-widest text-xs uppercase">Sincronizando datos...</p>
            </div>
        );
    }

    // Check data directly, not data.dashboard
    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 space-y-4">
                <AlertCircle size={48} />
                <p className="text-white/50 text-center px-8">Error al obtener datos.<br />Verifica tu conexión.</p>
                <button onClick={fetchStats} className="text-primary underline text-sm">Reintentar</button>
            </div>
        );
    }

    // Access properties directly from data
    // Defensive access: Ensure transactions is an array, default to empty
    const transactions = data.transactions || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'VERDE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            case 'AMARILLO': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'ROJO': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-white/10 text-white border-white/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'VERDE': return <CheckCircle2 size={32} />;
            case 'AMARILLO': return <AlertTriangle size={32} />;
            case 'ROJO': return <AlertCircle size={32} />;
            default: return <Wallet size={32} />;
        }
    };

    const getPayerStyle = (payer: string) => {
        const lowerPayer = payer.toLowerCase();
        if (lowerPayer.includes('ricky')) return 'bg-[#06b6d4]/20 text-[#06b6d4] border-[#06b6d4]/30';
        if (lowerPayer.includes('rosa')) return 'bg-[#e879f9]/20 text-[#e879f9] border-[#e879f9]/30';
        return 'bg-white/10 text-white/60 border-white/10';
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            const formatted = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
            // Capitalize first letter of month (e.g., "03 ene" -> "03 Ene")
            const parts = formatted.split(' ');
            if (parts.length === 2) {
                return `${parts[0]} ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
            }
            return formatted;
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 h-full pb-20">

            {/* Status Card */}
            <div className={clsx(
                "rounded-2xl p-6 border flex flex-col items-center text-center gap-4 relative overflow-hidden shrink-0",
                getStatusColor(data.status)
            )}>
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    {getStatusIcon(data.status)}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">Estado Actual</span>
                <h2 className="text-2xl font-bold tracking-wider">{data.message}</h2>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 shrink-0">
                <div className="flex justify-between text-xs uppercase tracking-widest text-white/40">
                    <span>Presupuesto Usado</span>
                    <span>{data.percentage}%</span>
                </div>
                <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                        className={clsx(
                            "h-full transition-all duration-1000 ease-out",
                            data.percentage > 90 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                                data.percentage > 75 ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" :
                                    "bg-primary shadow-[0_0_10px_rgba(132,204,22,0.5)]"
                        )}
                        style={{ width: `${Math.min(data.percentage, 100)}%` }}
                    />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
                <MetricCard label="Presupuesto" value={data.total_budget} icon={Wallet} />
                <MetricCard label="Gastado" value={data.total_spent} icon={TrendingUp} active />
                <MetricCard label="Disponible" value={data.remaining} icon={Wallet} />
            </div>

            {/* Transactions List */}
            <div className="flex flex-col gap-4 mt-2 overflow-hidden flex-1 min-h-[200px]">
                <div className="flex items-center gap-2 text-white/50 border-b border-white/5 pb-2">
                    <History size={16} />
                    <span className="text-xs uppercase tracking-widest font-bold">Últimos Gastos</span>
                </div>

                <div className="overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                    {Array.isArray(transactions) && transactions.length > 0 ? (
                        transactions.map((tx, idx) => (
                            <div key={idx} className="group bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-colors relative">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-sm text-white/90">{tx.concepto}</span>
                                    <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-wide">
                                        <span>{formatDate(tx.fecha)}</span>
                                        <span className={clsx(
                                            "px-1.5 rounded border pointer-events-none",
                                            getPayerStyle(tx.pagador)
                                        )}>
                                            {tx.pagador}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-bold text-primary text-lg">
                                        {typeof tx.cantidad === 'number' ? tx.cantidad.toFixed(2) : '0.00'}
                                    </span>
                                    <button
                                        onClick={() => deleteExpense(tx.id)}
                                        className="text-white/20 hover:text-red-400 transition-colors p-2 -mr-2"
                                        title="Eliminar gasto"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-white/30 text-xs italic">
                            No hay movimientos recientes
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

function MetricCard({ label, value, icon: Icon, active }: { label: string, value: number, icon: any, active?: boolean }) {
    return (
        <div className={clsx(
            "bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col gap-2 relative overflow-hidden",
            active && "bg-white/10 border-white/10"
        )}>
            <div className="text-[8px] uppercase tracking-wider text-white/40 flex items-center justify-between truncate">
                {label}
                <Icon size={10} className="opacity-50 shrink-0" />
            </div>
            <div className="font-mono text-lg font-bold truncate">
                {value?.toLocaleString('es-ES') || '0'}
            </div>
        </div>
    );
}

