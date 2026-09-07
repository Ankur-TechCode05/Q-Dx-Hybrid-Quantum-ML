import type { RiskLevel } from '@/types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export function RiskGauge({ score, level, size = 200 }: RiskGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference * 0.75;

  const colors = {
    low: { stroke: '#10b981', glow: '#10b981', text: 'text-emerald-500', bg: 'bg-emerald-500' },
    moderate: { stroke: '#f59e0b', glow: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-500' },
    high: { stroke: '#f43f5e', glow: '#f43f5e', text: 'text-rose-500', bg: 'bg-rose-500' },
  };

  const c = colors[level];

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        <defs>
          <linearGradient id={`gauge-${level}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.stroke} stopOpacity="0.6" />
            <stop offset="100%" stopColor={c.stroke} />
          </linearGradient>
          <filter id={`glow-${level}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-slate-200 dark:text-slate-800"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gauge-${level})`}
          strokeWidth="10"
          strokeDasharray={circumference * 0.75}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter={`url(#glow-${level})`}
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-display font-bold ${c.text}`}>{score}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Risk Score</span>
        <span className={`badge ${level === 'low' ? 'badge-low' : level === 'moderate' ? 'badge-moderate' : 'badge-high'} mt-2 capitalize`}>
          {level} Risk
        </span>
      </div>
    </div>
  );
}
