export function Header() {
    return (
        <header className="flex items-center justify-between p-4 border-b border-white/5 bg-background/50 backdrop-blur-md fixed top-0 w-full z-50 h-16">
            <h1 className="text-xl font-bold tracking-[0.2em] text-white/90 font-mono">
                CUENTAS<span className="text-primary">CLARAS</span>
            </h1>
            <div className="flex items-center gap-3 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </div>
                <span className="text-[10px] text-primary/80 tracking-widest font-mono uppercase">Sistema Online</span>
            </div>
        </header>
    );
}
