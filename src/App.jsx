import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Zap, RefreshCw, Layers, Sparkles, CheckCircle2, Sun, Moon } from 'lucide-react';

import SummaryCards from './components/SummaryCards';
import { RevenueTrendChart, CategoryBreakdownChart } from './components/Charts';
import DataTable from './components/DataTable';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

const DATA_URL = '/mock-data.json';

const SAMPLE_CUSTOMERS = [
  { name: 'Liam Neeson', email: 'liam.n@example.com' },
  { name: 'Olivia Wilde', email: 'olivia.w@example.com' },
  { name: 'Noah Schnapp', email: 'noah.s@example.com' },
  { name: 'Emma Watson', email: 'emma.w@example.com' },
  { name: 'Oliver Jackson', email: 'oliver.j@example.com' },
  { name: 'Charlotte Gainsbourg', email: 'charlotte.g@example.com' },
  { name: 'Elijah Wood', email: 'elijah.w@example.com' },
  { name: 'Amelia Earhart', email: 'amelia.e@example.com' },
  { name: 'James McAvoy', email: 'james.m@example.com' },
  { name: 'Sophia Loren', email: 'sophia.l@example.com' },
  { name: 'Lucas Hedges', email: 'lucas.h@example.com' },
  { name: 'Mia Farrow', email: 'mia.f@example.com' },
  { name: 'Mason Mount', email: 'mason.m@example.com' },
  { name: 'Isabella Rossellini', email: 'isabella.r@example.com' }
];

const CATEGORY_ITEMS = [
  { name: 'Electronics', colors: '#3b82f6', range: [80, 1200] },
  { name: 'Apparel', colors: '#10b981', range: [15, 180] },
  { name: 'Home & Kitchen', colors: '#f59e0b', range: [25, 350] },
  { name: 'Office Supplies', colors: '#8b5cf6', range: [8, 150] },
  { name: 'Books', colors: '#ec4899', range: [10, 60] }
];

export default function App() {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLive, setIsLive] = useState(true);
  
  const [feedVelocity, setFeedVelocity] = useState(4500);
  const [secondsSinceLast, setSecondsSinceLast] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard-theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  const orderIdCounter = useRef(1025);

  useEffect(() => {
    if (!isLive || status !== 'success') {
      setSecondsSinceLast(0);
      return;
    }
    const tick = setInterval(() => {
      setSecondsSinceLast((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(tick);
  }, [isLive, status]);

  const fetchDashboardData = useCallback(async () => {
    setStatus('loading');
    try {
      const [res] = await Promise.all([
        fetch(DATA_URL),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const json = await res.json();
      setData(json);
      setStatus('success');
      setSecondsSinceLast(0);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch ledger endpoint');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const triggerNewOrder = useCallback(() => {
    if (!data) return;

    setSecondsSinceLast(0);

    const customer = SAMPLE_CUSTOMERS[Math.floor(Math.random() * SAMPLE_CUSTOMERS.length)];
    const catConfig = CATEGORY_ITEMS[Math.floor(Math.random() * CATEGORY_ITEMS.length)];
    
    const [minPrice, maxPrice] = catConfig.range;
    const amount = parseFloat((Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2));
    
    const nextId = `ORD-${orderIdCounter.current}`;
    orderIdCounter.current += 1;

    const statusPool = ['Completed', 'Completed', 'Completed', 'Processing', 'Shipped', 'Pending'];
    const orderStatus = statusPool[Math.floor(Math.random() * statusPool.length)];

    const todayStr = new Date().toISOString().split('T')[0];

    const newOrder = {
      id: nextId,
      customer: customer.name,
      email: customer.email,
      date: todayStr,
      amount: amount,
      status: orderStatus,
      category: catConfig.name,
      isNew: true
    };

    const notifId = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [
      {
        id: notifId,
        message: `New Order: ${newOrder.id}`,
        sub: `${customer.name} ordered ${catConfig.name} for $${amount.toFixed(2)}`
      },
      ...prev.slice(0, 2)
    ]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    }, 3500);

    setData((prevData) => {
      if (!prevData) return null;

      const updatedOrders = [newOrder, ...prevData.orders.map(o => ({ ...o, isNew: false }))].slice(0, 50);

      const newTotalRevenue = prevData.summary.totalRevenue + amount;
      const newTotalOrders = prevData.summary.totalOrders + 1;
      const newAOV = parseFloat((newTotalRevenue / newTotalOrders).toFixed(2));
      
      const newRevenueChange = parseFloat((prevData.summary.revenueChange + 0.05).toFixed(2));
      const newOrdersChange = parseFloat((prevData.summary.ordersChange + 0.04).toFixed(2));
      const newAOVChange = parseFloat((prevData.summary.aovChange + 0.01).toFixed(2));
      
      const summary = {
        ...prevData.summary,
        totalRevenue: newTotalRevenue,
        totalOrders: newTotalOrders,
        averageOrderValue: newAOV,
        revenueChange: newRevenueChange,
        ordersChange: newOrdersChange,
        aovChange: newAOVChange
      };

      const updatedBreakdown = prevData.categoryBreakdown.map((item) => {
        if (item.name === catConfig.name) {
          const updatedValue = item.value + amount;
          return { ...item, value: parseFloat(updatedValue.toFixed(2)) };
        }
        return item;
      });

      const sumCategoryValue = updatedBreakdown.reduce((sum, curr) => sum + curr.value, 0);
      const categoryBreakdown = updatedBreakdown.map((item) => ({
        ...item,
        percentage: Math.round((item.value / sumCategoryValue) * 100)
      }));

      const updatedTrend = prevData.revenueTrend.map((month) => {
        if (month.name === 'Jul') {
          return {
            ...month,
            revenue: parseFloat((month.revenue + amount).toFixed(2)),
            orders: month.orders + 1
          };
        }
        return month;
      });

      return {
        summary,
        revenueTrend: updatedTrend,
        categoryBreakdown,
        orders: updatedOrders
      };
    });
  }, [data]);

  useEffect(() => {
    if (!isLive || status !== 'success') return;

    const getNextInterval = () => {
      const base = feedVelocity;
      const fuzz = Math.floor(Math.random() * (base * 0.4)) - (base * 0.2);
      return Math.max(800, base + fuzz);
    };
    
    let timerId;
    const runTicker = () => {
      triggerNewOrder();
      timerId = setTimeout(runTicker, getNextInterval());
    };

    timerId = setTimeout(runTicker, getNextInterval());
    return () => clearTimeout(timerId);
  }, [isLive, status, feedVelocity, triggerNewOrder]);

  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState message={errorMessage} onRetry={fetchDashboardData} />;
  if (!data) return null;

  return (
    <div id="dashboard-root" className={`min-h-screen flex flex-col font-sans select-none antialiased relative transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/50 text-slate-600'}`}>
      
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)]'} bg-[size:24px_24px] pointer-events-none`} />

      <div id="pipeline-bar" className="bg-slate-900 text-slate-300 text-[11px] py-2 px-6 sm:px-8 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-indigo-400 font-semibold uppercase tracking-wider text-[10px]">
            <Sparkles size={12} className="animate-pulse" />
            Active Segment
          </span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            Status: {isLive ? 'Streaming Live' : 'Paused'}
          </span>
        </div>
        
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline">
            Processed Live: <strong className="text-white font-semibold">{(data.orders.length - 8)} orders</strong>
          </span>
          <span className="hidden md:inline">
            Average Feed Velocity: <strong className="text-indigo-300 font-semibold">5.5s</strong>
          </span>
          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`p-1 rounded-md transition-all hover:bg-slate-800 hover:text-white cursor-pointer ${
                isLive ? 'text-emerald-400' : 'text-slate-400'
              }`}
              title={isLive ? 'Pause Stream Simulation' : 'Resume Stream Simulation'}
            >
              {isLive ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={triggerNewOrder}
              className="p-1 rounded-md text-indigo-400 hover:text-indigo-300 transition-all hover:bg-slate-800 cursor-pointer"
              title="Force New Demo Order"
            >
              <Zap size={14} />
            </button>
          </div>
        </div>
      </div>

      <header id="dashboard-header" className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 sticky top-0 z-20 py-5 px-6 sm:px-8 shadow-sm shadow-slate-100/50 dark:shadow-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Layers size={13} strokeWidth={2.5} />
              <span>Ledger Dashboard</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
              Revenue &amp; Orders Controller
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">LEDGER SYNC</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium font-mono">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-750 dark:hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw size={12} className="animate-spin-slow" />
              <span>Hard Sync</span>
            </button>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="inline-flex items-center justify-center p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-750 dark:hover:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={14} className="text-slate-600" /> : <Sun size={14} className="text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      <main id="dashboard-main" className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-8 space-y-8 relative">
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850">
              <span className={`absolute inline-flex h-3.5 w-3.5 rounded-full ${isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-300'} opacity-35`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold block tracking-wider">LIVE DATA FEED MONITOR</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {isLive ? 'Continuous Stream Active' : 'Simulation Paused'}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold transition-all duration-300 ${
                  secondsSinceLast === 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 animate-pulse' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                }`}>
                  {secondsSinceLast === 0 ? '• New entry received' : `Last update: ${secondsSinceLast}s ago`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap hidden sm:inline">Stream Frequency:</span> */}
            {/* <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full sm:w-auto">
              {[
                { label: '⚡ Fast (1.5s)', val: 1500 },
                { label: '⏱️ Normal (4.5s)', val: 4500 },
                { label: '⏳ Steady (9s)', val: 9000 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => {
                    setFeedVelocity(preset.val);
                    setIsLive(true);
                  }}
                  className={`flex-1 sm:flex-none text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    feedVelocity === preset.val && isLive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {preset.label.split(' ')[1]}
                </button>
              ))}
              <button
                onClick={() => setIsLive(false)}
                className={`flex-1 sm:flex-none text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isLive ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                ⏸️ Pause
              </button>
            </div> */}

            <button
              onClick={triggerNewOrder}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all w-full sm:w-auto ml-auto"
            >
              <Zap size={13} className="fill-white" />
              <span>Simulate Order</span>
            </button>
          </div>
        </motion.div>

        <section id="summary-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Performance Indicators
            </h2>
            {isLive && (
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono font-medium animate-pulse">
                &bull; Live stream auto-updating
              </span>
            )}
          </div>
          <SummaryCards summary={data.summary} />
        </section>

        <section id="trends-section" className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Distribution &amp; Trajectory
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueTrendChart data={data.revenueTrend} theme={theme} />
            </div>
            <div>
              <CategoryBreakdownChart data={data.categoryBreakdown} theme={theme} />
            </div>
          </div>
        </section>

        <section id="ledger-section" className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Audit Ledger
          </h2>
          <DataTable orders={data.orders} />
        </section>
      </main>

      <footer id="dashboard-footer" className="py-6 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Ledger Dashboard &bull; Secure Enterprise Environment</span>
          <span>© 2026 Local Portal Host &bull; Port 3000 Feed</span>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none w-full max-w-sm px-4 sm:px-0">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
              className="bg-slate-900 border border-slate-800 text-slate-100 p-4 rounded-2xl shadow-xl flex items-start gap-3 pointer-events-auto"
            >
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-xs font-semibold text-white truncate">
                  {notif.message}
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  {notif.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
