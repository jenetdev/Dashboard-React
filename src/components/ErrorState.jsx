import { AlertCircle, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div id="error-container" className="min-h-screen bg-slate-50/50 flex flex-col justify-center items-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white border border-rose-100 rounded-3xl p-8 shadow-xl shadow-rose-950/[0.02] text-center"
      >
        <div className="mx-auto w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-500">
          <AlertCircle size={32} />
        </div>
        
        <h2 className="text-xl font-semibold text-slate-950 mb-2">
          Unable to Load Ledger
        </h2>
        
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {message || 'An unexpected error occurred while fetching the dashboard data. Please verify your connection and try again.'}
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left border border-slate-100">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Error Details
          </div>
          <div className="font-mono text-xs text-rose-600 break-all">
            {message || 'ERR_CONNECTION_REFUSED'}
          </div>
        </div>

        <button
          onClick={onRetry}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-medium transition-all duration-200 shadow-md shadow-slate-950/10 hover:shadow-lg active:scale-[0.98] cursor-pointer"
        >
          <RotateCw size={16} className="animate-spin-slow" />
          <span>Try Loading Again</span>
        </button>
      </motion.div>
    </div>
  );
}
