import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Eye, Target, Sparkles, Milestone } from 'lucide-react';

const TrendTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-slate-100 border border-slate-800 p-3.5 rounded-xl shadow-xl text-xs font-sans space-y-1.5">
        <p className="font-semibold text-slate-300">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-4 justify-between">
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-mono font-medium" style={{ color: p.color || '#6366f1' }}>
              {p.name === 'Revenue'
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p.value)
                : `${p.value} orders`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueTrendChart({ data, theme }) {
  const isDark = theme === 'dark';
  const [activeView, setActiveView] = useState('omni');
  const [showTarget, setShowTarget] = useState(true);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return { avg: 0, peak: 0, peakMonth: '' };
    const sum = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const avg = sum / data.length;
    
    let peak = 0;
    let peakMonth = '';
    data.forEach((month) => {
      if (month.revenue > peak) {
        peak = month.revenue;
        peakMonth = month.name;
      }
    });

    return { avg, peak, peakMonth };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col h-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Revenue Growth Trend</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Monthly trajectory of aggregate transaction value</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/40 dark:border-indigo-900/30 rounded-xl px-2.5 py-1 text-left">
            <span className="text-[9px] font-mono font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-wider block">MONTHLY AVG</span>
            <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 font-mono">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.avg)}
            </span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/40 dark:border-emerald-900/30 rounded-xl px-2.5 py-1 text-left">
            <span className="text-[9px] font-mono font-bold text-emerald-400 dark:text-emerald-500 uppercase tracking-wider block">PEAK ({stats.peakMonth})</span>
            <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 font-mono">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stats.peak)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-1.5 rounded-xl mb-6">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold pl-1.5 uppercase tracking-wider">Metrics</span>
          <div className="flex bg-slate-200/60 dark:bg-slate-900 p-0.5 rounded-lg">
            {[
              { id: 'omni', label: 'Omni View' },
              { id: 'revenue', label: 'Revenue' },
              { id: 'orders', label: 'Orders' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveView(btn.id)}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeView === btn.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowTarget(!showTarget)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 border rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
            showTarget
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Target size={11} className={showTarget ? 'animate-pulse' : ''} />
          <span>{showTarget ? 'Target Line (ON)' : 'Target Line (OFF)'}</span>
        </button>
      </div>

      <div className="flex-1 w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
            <XAxis
              dataKey="name"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val / 1000}k`}
              dx={-5}
            />
            <Tooltip content={<TrendTooltip />} />
            
            {showTarget && (
              <ReferenceLine
                y={20000}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Target Limit ($20k)',
                  fill: isDark ? '#fb7185' : '#e11d48',
                  fontSize: 10,
                  fontWeight: 'bold',
                  position: 'insideBottomRight',
                  dy: -4,
                }}
              />
            )}

            {(activeView === 'omni' || activeView === 'revenue') && (
              <Area
                name="Revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            )}
            
            {(activeView === 'omni' || activeView === 'orders') && (
              <Area
                name="Orders"
                type="monotone"
                dataKey="orders"
                stroke="#0ea5e9"
                strokeWidth={2}
                strokeDasharray={activeView === 'omni' ? "4 4" : "0"}
                fillOpacity={1}
                fill={activeView === 'orders' ? "url(#colorOrders)" : "none"}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

const CategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 text-slate-100 border border-slate-800 p-3 rounded-xl shadow-xl text-xs font-sans space-y-1">
        <p className="font-semibold text-slate-300">{d.name}</p>
        <div className="flex items-center gap-4 justify-between">
          <span className="text-slate-400">Share:</span>
          <span className="font-mono font-semibold text-emerald-400">{d.percentage}%</span>
        </div>
        <div className="flex items-center gap-4 justify-between">
          <span className="text-slate-400">Value:</span>
          <span className="font-mono text-slate-300">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(d.value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function CategoryBreakdownChart({ data, theme }) {
  const isDark = theme === 'dark';
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white flex items-center gap-2">
            <PieIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Category Contribution</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Revenue split across business sectors</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[220px]">
        <div className="w-[180px] h-[180px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CategoryTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Share</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">100%</span>
          </div>
        </div>

        {/* <div className="flex-1 space-y-2.5 w-full">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[110px] sm:max-w-none">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-400 dark:text-slate-500">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.value)}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 w-10 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </motion.div>
  );
}
