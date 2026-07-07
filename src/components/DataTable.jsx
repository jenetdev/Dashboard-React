import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Layers, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';

export default function DataTable({ orders }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = useMemo(() => {
    const list = new Set(orders.map((o) => o.category));
    return ['All', ...Array.from(list)];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || order.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [orders, searchQuery, statusFilter, categoryFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30';
      case 'Processing':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30';
      case 'Shipped':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 dark:border-sky-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20 dark:border-slate-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 size={13} className="mr-1 inline" />;
      case 'Processing':
        return <Loader2 size={13} className="mr-1 inline animate-spin" />;
      case 'Shipped':
        return <Clock size={13} className="mr-1 inline" />;
      case 'Pending':
        return <Clock size={13} className="mr-1 inline" />;
      case 'Cancelled':
        return <AlertCircle size={13} className="mr-1 inline" />;
    }
  };

  return (
    <div id="order-ledger-container" className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Stream of processed checkout requests and ledger entries</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ledger Feed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search ID, customer, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="All" className="dark:bg-slate-950">All Statuses</option>
                <option value="Completed" className="dark:bg-slate-950">Completed</option>
                <option value="Processing" className="dark:bg-slate-950">Processing</option>
                <option value="Shipped" className="dark:bg-slate-950">Shipped</option>
                <option value="Pending" className="dark:bg-slate-950">Pending</option>
                <option value="Cancelled" className="dark:bg-slate-950">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-slate-950">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
          <thead>
            <tr className="bg-slate-50/20 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Amount</th>
              <th className="py-4 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            <AnimatePresence initial={false}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={order.isNew ? { backgroundColor: 'rgba(99, 102, 241, 0.08)', opacity: 0, height: 0 } : false}
                    animate={{ backgroundColor: 'rgba(255, 255, 255, 0)', opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`hover:bg-slate-50/40 dark:hover:bg-slate-950/40 transition-colors duration-150 ${
                      order.isNew ? 'border-l-2 border-indigo-500' : ''
                    }`}
                  >
                    <td className="py-4 px-6 font-mono font-medium text-slate-900 dark:text-indigo-400">
                      <div className="flex items-center gap-2">
                        {order.isNew && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping shrink-0" />
                        )}
                        <span>{order.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-950 dark:text-slate-100">{order.customer}</div>
                      <div className="text-slate-400 dark:text-slate-500 text-[10px] font-mono">{order.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-medium text-[10px]">
                        {order.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 dark:text-slate-500">
                      {order.date}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-semibold text-slate-950 dark:text-slate-100">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.amount)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-600">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={24} className="text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                      <span>No transactions match the criteria</span>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 dark:text-slate-500 text-[11px] font-medium">
        <span>Showing {filteredOrders.length} of {orders.length} transactions</span>
        <span>Simulated at customizable frequency &bull; Auto-scrolling ledger</span>
      </div>
    </div>
  );
}
