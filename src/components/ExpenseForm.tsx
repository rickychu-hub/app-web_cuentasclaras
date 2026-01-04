import { useState } from 'react';
import { ShoppingCart, PawPrint, Home, Gamepad2, CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

type Payer = 'Ricky' | 'Rosa';
type Category = 'Super' | 'Mascota' | 'Casa' | 'Ocio';

const CATEGORIES: { id: Category; icon: React.ElementType }[] = [
    { id: 'Super', icon: ShoppingCart },
    { id: 'Mascota', icon: PawPrint },
    { id: 'Casa', icon: Home },
    { id: 'Ocio', icon: Gamepad2 },
];

export function ExpenseForm() {
    const [payer, setPayer] = useState<Payer>('Ricky');
    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    const [category, setCategory] = useState<Category>('Super');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !concept) return;

        setIsSubmitting(true);

        const payload = {
            payer,
            amount: parseFloat(amount),
            concept,
            category,
        };

        try {
            const response = await fetch('https://n8n-motor.onrender.com/webhook/equity-hub-ingest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setToast({ show: true, message: 'Gasto Guardado', type: 'success' });

            // Reset form on success
            setAmount('');
            setConcept('');

        } catch (error) {
            console.error('Submission error:', error);
            setToast({ show: true, message: 'Error de Conexión', type: 'error' });
            // Do NOT reset form on error
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full relative">
            {/* Toast Notification */}
            <div className={clsx(
                "fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold tracking-wider flex items-center gap-2 shadow-lg transition-all duration-300 z-50 pointer-events-none whitespace-nowrap",
                toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
                toast.type === 'success'
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(132,204,22,0.4)]"
                    : "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            )}>
                {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {toast.message}
            </div>

            {/* Payer Selector */}
            <div className="grid grid-cols-2 gap-4">
                {['Ricky', 'Rosa'].map((p) => {
                    const isSelected = payer === p;
                    const isRicky = p === 'Ricky';

                    const colorClasses = isRicky
                        ? (isSelected
                            ? "bg-[#06b6d4] border-[#06b6d4] text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                            : "bg-black/20 border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10")
                        : (isSelected
                            ? "bg-[#e879f9] border-[#e879f9] text-black shadow-[0_0_15px_rgba(232,121,249,0.4)]"
                            : "bg-black/20 border-[#e879f9] text-[#e879f9] hover:bg-[#e879f9]/10");

                    return (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPayer(p as Payer)}
                            className={clsx(
                                "h-16 text-xl font-bold rounded-xl border transition-all duration-200 uppercase tracking-widest",
                                colorClasses
                            )}
                        >
                            {p}
                        </button>
                    );
                })}
            </div>

            {/* Amount Input */}
            <div className="relative group">
                <label className="text-[10px] uppercase tracking-widest text-white/30 absolute top-2 left-4">Importe</label>
                <input
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl h-32 text-center text-6xl font-mono text-primary placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-black/60 transition-all selection:bg-primary/30 pt-4"
                />
                <div className="absolute top-4 right-4 text-white/20">
                    <Zap size={16} />
                </div>
            </div>

            {/* Concept Input */}
            <div className="relative">
                <label className="text-[10px] uppercase tracking-widest text-white/30 absolute -top-2 left-2 bg-background px-2">Concepto</label>
                <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="¿Qué hay que pagar?"
                    className="w-full bg-transparent border-b border-white/10 py-3 px-2 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors font-mono"
                />
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-2 h-20 rounded-xl border transition-all duration-200",
                            category === cat.id
                                ? "bg-white/10 border-primary/50 text-white shadow-[0_0_10px_rgba(132,204,22,0.1)]"
                                : "bg-transparent border-white/5 text-white/30 hover:bg-white/5"
                        )}
                    >
                        <cat.icon size={20} className={clsx(category === cat.id && "text-primary")} />
                        <span className="text-[10px] uppercase tracking-wide">{cat.id}</span>
                    </button>
                ))}
            </div>

            {/* CTA Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full h-16 bg-primary text-black text-xl font-bold tracking-widest rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(132,204,22,0.3)] disabled:opacity-50 disabled:pointer-events-none uppercase"
            >
                {isSubmitting ? (
                    <span className="animate-pulse">Registrando...</span>
                ) : (
                    <>
                        Registrar Gasto
                        <Zap size={20} fill="black" />
                    </>
                )}
            </button>
        </form>
    );
}
