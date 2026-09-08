import { useEffect, useState } from 'react';

/**
 * Animated quantum circuit visualization.
 * Shows qubits, quantum gates (H, CNOT, RY, etc.), and measurement operations.
 */
export function QuantumCircuit({ active = false }: { active?: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 12);
    }, 400);
    return () => clearInterval(interval);
  }, [active]);

  const qubits = ['q₀', 'q₁', 'q₂', 'q₃'];
  const gates = [
    { col: 1, row: 0, type: 'H', color: 'from-cyan-400 to-blue-500' },
    { col: 1, row: 1, type: 'H', color: 'from-cyan-400 to-blue-500' },
    { col: 2, row: 0, type: '●', color: 'from-brand-400 to-brand-600', link: 1 },
    { col: 2, row: 1, type: '⊕', color: 'from-accent-400 to-accent-600' },
    { col: 3, row: 2, type: 'H', color: 'from-cyan-400 to-blue-500' },
    { col: 3, row: 3, type: 'H', color: 'from-cyan-400 to-blue-500' },
    { col: 4, row: 1, type: 'RY', color: 'from-emerald-400 to-teal-500' },
    { col: 4, row: 2, type: 'RZ', color: 'from-emerald-400 to-teal-500' },
    { col: 5, row: 0, type: '●', color: 'from-brand-400 to-brand-600', link: 2 },
    { col: 5, row: 2, type: '⊕', color: 'from-accent-400 to-accent-600' },
    { col: 6, row: 1, type: '●', color: 'from-brand-400 to-brand-600', link: 3 },
    { col: 6, row: 3, type: '⊕', color: 'from-accent-400 to-accent-600' },
    { col: 7, row: 0, type: 'M', color: 'from-rose-400 to-rose-600' },
    { col: 7, row: 1, type: 'M', color: 'from-rose-400 to-rose-600' },
    { col: 7, row: 2, type: 'M', color: 'from-rose-400 to-rose-600' },
    { col: 7, row: 3, type: 'M', color: 'from-rose-400 to-rose-600' },
  ];

  const cols = 7;

  return (
    <div className="glass-card p-6 overflow-x-auto scrollbar-thin">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white">Quantum Circuit</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">4-qubit feature map with variational gates</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {active ? 'EXECUTING' : 'IDLE'}
          </span>
        </div>
      </div>

      <div className="min-w-[600px]">
        {qubits.map((qubit, row) => (
          <div key={row} className="flex items-center mb-2">
            <div className="w-10 text-sm font-mono text-slate-600 dark:text-slate-400 flex-shrink-0">
              {qubit}
            </div>
            <div className="flex-1 relative h-12">
              {/* Wire */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-300 dark:bg-slate-700 -translate-y-1/2" />

              {/* Gates */}
              {gates
                .filter((g) => g.row === row)
                .map((gate, i) => {
                  const isActive = active && step >= gate.col;
                  return (
                    <div
                      key={i}
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-lg bg-gradient-to-br ${gate.color} flex items-center justify-center text-white text-xs font-mono font-bold transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-100 shadow-lg' : 'opacity-30 scale-90'
                      }`}
                      style={{ left: `${(gate.col / (cols + 1)) * 100}%` }}
                    >
                      {gate.type}
                    </div>
                  );
                })}

              {/* CNOT connection lines */}
              {gates
                .filter((g) => g.row === row && g.link !== undefined)
                .map((gate, i) => (
                  <div
                    key={`link-${i}`}
                    className={`absolute top-1/2 w-px bg-slate-400 dark:bg-slate-500 transition-opacity duration-300 ${
                      active && step >= gate.col ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{
                      left: `${(gate.col / (cols + 1)) * 100}%`,
                      height: `${Math.abs(gate.link! - row) * 48}px`,
                      transform: `translate(-50%, ${gate.link! > row ? '0' : `-${Math.abs(gate.link! - row) * 48}px`})`,
                    }}
                  />
                ))}
            </div>
          </div>
        ))}

        {/* Classical register */}
        <div className="flex items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="w-10 text-sm font-mono text-slate-600 dark:text-slate-400 flex-shrink-0">c</div>
          <div className="flex-1 h-6 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-300 dark:bg-slate-700 -translate-y-1/2" />
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-300 ${
                active && step >= 7 ? 'opacity-100' : 'opacity-40'
              }`}
              style={{ left: `${(7 / (cols + 1)) * 100}%` }}
            >
              measure
            </div>
          </div>
        </div>
      </div>

      {active && (
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="text-brand-500">→</span>
          Step {step + 1} / 12 · Simulating on Qiskit Aer backend
        </div>
      )}
    </div>
  );
}
