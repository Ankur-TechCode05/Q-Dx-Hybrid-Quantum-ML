interface BarChartProps {
  data: { label: string; value: number; max?: number }[];
  height?: number;
  color?: string;
}

export function BarChart({ data, height = 200, color = 'from-brand-500 to-accent-500' }: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.max ?? d.value));
  const barWidth = 100 / data.length;

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-around h-full gap-2">
        {data.map((d, i) => {
          const pct = (d.value / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                {d.value}
              </span>
              <div className="w-full max-w-[50px] flex flex-col justify-end flex-1">
                <div
                  className={`w-full rounded-t-lg bg-gradient-to-t ${color} transition-all duration-1000 ease-out`}
                  style={{ height: `${pct}%`, minHeight: '4px' }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center truncate max-w-full">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ComparisonBarProps {
  classical: number;
  quantum: number;
  label: string;
  max?: number;
}

export function ComparisonBar({ classical, quantum, label, max = 100 }: ComparisonBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-16">Classical</span>
          <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: `${(classical / max) * 100}%` }}
            >
              <span className="text-xs font-mono font-semibold text-white">{classical}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-16">Quantum</span>
          <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: `${(quantum / max) * 100}%` }}
            >
              <span className="text-xs font-mono font-semibold text-white">{quantum}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RadarChartProps {
  data: { label: string; classical: number; quantum: number }[];
  size?: number;
}

export function RadarChart({ data, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (value: number, index: number, max: number = 100) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / max) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const classicalPoints = data.map((d, i) => getPoint(d.classical, i)).map(p => `${p.x},${p.y}`).join(' ');
  const quantumPoints = data.map((d, i) => getPoint(d.quantum, i)).map(p => `${p.x},${p.y}`).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex justify-center">
      <svg width={size} height={size}>
        <defs>
          <radialGradient id="classical-fill">
            <stop offset="0%" stopColor="#3361ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3361ff" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id="quantum-fill">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Grid */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={data.map((_, j) => {
              const angle = j * angleStep - Math.PI / 2;
              const r = level * maxRadius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-200 dark:text-slate-700"
          />
        ))}

        {/* Axes */}
        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          const lx = center + (maxRadius + 20) * Math.cos(angle);
          const ly = center + (maxRadius + 20) * Math.sin(angle);
          return (
            <g key={i}>
              <line x1={center} y1={center} x2={x} y2={y} className="text-slate-200 dark:text-slate-700" stroke="currentColor" strokeWidth="1" />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium">
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Classical polygon */}
        <polygon points={classicalPoints} fill="url(#classical-fill)" stroke="#3361ff" strokeWidth="2" />

        {/* Quantum polygon */}
        <polygon points={quantumPoints} fill="url(#quantum-fill)" stroke="#8b5cf6" strokeWidth="2" />

        {/* Points */}
        {data.map((d, i) => {
          const cp = getPoint(d.classical, i);
          const qp = getPoint(d.quantum, i);
          return (
            <g key={i}>
              <circle cx={cp.x} cy={cp.y} r="3" fill="#3361ff" />
              <circle cx={qp.x} cy={qp.y} r="3" fill="#8b5cf6" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ segments, size = 180 }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = (size - 30) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            className="text-slate-100 dark:text-slate-800"
          />
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * circumference;
            const circle = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-slate-900 dark:text-white">{total}%</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Total</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{seg.label} ({seg.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
