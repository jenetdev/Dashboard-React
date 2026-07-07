import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { DollarSign, ShoppingBag, Receipt, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const [activeFlashes, setActiveFlashes] = useState({});
  
  const prevVals = useRef({
    revenue: summary.totalRevenue,
    orders: summary.totalOrders,
    aov: summary.averageOrderValue,
    conversion: summary.conversionRate
  });

  useEffect(() => {
    const flashes = {};
    let updated = false;

    if (summary.totalRevenue !== prevVals.current.revenue) {
      flashes['Total Revenue'] = true;
      prevVals.current.revenue = summary.totalRevenue;
      updated = true;
    }
    if (summary.totalOrders !== prevVals.current.orders) {
      flashes['Total Orders'] = true;
      prevVals.current.orders = summary.totalOrders;
      updated = true;
    }
    if (summary.averageOrderValue !== prevVals.current.aov) {
      flashes['Average Order Value'] = true;
      prevVals.current.aov = summary.averageOrderValue;
      updated = true;
    }
    if (summary.conversionRate !== prevVals.current.conversion) {
      flashes['Conversion Rate'] = true;
      prevVals.current.conversion = summary.conversionRate;
      updated = true;
    }

    if (updated) {
      setActiveFlashes((prev) => ({ ...prev, ...flashes }));
      
      const timer = setTimeout(() => {
        setActiveFlashes((prev) => {
          const next = { ...prev };
          Object.keys(flashes).forEach((key) => {
            next[key] = false;
          });
          return next;
        });
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [summary]);

  const cardConfigs = [
    {
      title: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.totalRevenue),
      change: summary.revenueChange,
      label: 'vs last month',
      icon: DollarSign,
      color: 'indigo',
      glowColor: 'group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/5',
      activeGlow: 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.02]',
      bgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100/50 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/30',
    },
    {
      title: 'Total Orders',
      value: new Intl.NumberFormat('en-US').format(summary.totalOrders),
      change: summary.ordersChange,
      label: 'vs last month',
      icon: ShoppingBag,
      color: 'emerald',
      glowColor: 'group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/5',
      activeGlow: 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg shadow-emerald-500/10 scale-[1.02]',
      bgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30',
    },
    {
      title: 'Average Order Value',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(summary.averageOrderValue),
      change: summary.aovChange,
      label: 'vs last month',
      icon: Receipt,
      color: 'amber',
      glowColor: 'group-hover:border-amber-500/40 group-hover:shadow-amber-500/5',
      activeGlow: 'border-amber-500 ring-2 ring-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.02]',
      bgClass: 'bg-amber-50 text-amber-600 border-amber-100/50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30',
    },
    {
      title: 'Conversion Rate',
      value: `${summary.conversionRate}%`,
      change: summary.conversionChange,
      label: 'vs last month',
      icon: Target,
      color: 'rose',
      glowColor: 'group-hover:border-rose-500/40 group-hover:shadow-rose-500/5',
      activeGlow: 'border-rose-500 ring-2 ring-rose-500/10 shadow-lg shadow-rose-500/10 scale-[1.02]',
      bgClass: 'bg-rose-50 text-rose-600 border-rose-100/50 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30',
    }
  ];

  return (
    <div id="summary-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardConfigs.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        const isFlashing = activeFlashes[card.title];

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm transition-all duration-500 ease-out ${
              isFlashing ? card.activeGlow : `hover:shadow-md ${card.glowColor}`
            }`}
          >
            {isFlashing && (
              <span className="absolute top-3 right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 dark:bg-slate-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500 dark:bg-slate-400"></span>
              </span>
            )}

            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {card.title}
                </span>
                <span className={`text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight block transition-colors duration-300 ${isFlashing ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                  {card.value}
                </span>
              </div>
              <div className={`p-3 rounded-2xl border ${card.bgClass} transition-transform group-hover:scale-105 duration-300 ${isFlashing ? 'scale-110' : ''}`}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium transition-transform duration-300 ${
                  isPositive
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/30'
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-100/60 dark:border-rose-900/30'
                } ${isFlashing ? 'scale-105' : ''}`}
              >
                {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                <span>{Math.abs(card.change)}%</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {card.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
