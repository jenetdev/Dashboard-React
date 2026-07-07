import { motion } from 'motion/react';

export default function LoadingState() {
  return (
    <div id="loading-container" className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-sans">
      <header id="loading-header" className="bg-white border-b border-slate-100 py-5 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-4 w-20 bg-slate-200 rounded-full animate-pulse mb-2" />
            <div className="h-6 w-56 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
      </header>

      <main id="loading-main" className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-10 space-y-10">
        
        <section id="loading-summary">
          <div className="h-4 w-28 bg-slate-200 rounded-full animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse mb-3" />
                <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-80 flex flex-col justify-between">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="flex-1 bg-slate-50 rounded-xl animate-pulse" />
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-80 flex flex-col justify-between">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-4" />
            <div className="flex-1 bg-slate-50 rounded-xl animate-pulse" />
          </div>
        </div>

        <section id="loading-orders">
          <div className="h-4 w-28 bg-slate-200 rounded-full animate-pulse mb-6" />
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-4">
              <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 border-b border-slate-50 flex items-center px-6 gap-4">
                <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
                <div className="h-4.5 w-28 bg-slate-100 rounded animate-pulse" />
                <div className="h-4.5 w-16 bg-slate-100 rounded-full animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="loading-footer" className="py-6 border-t border-slate-100 text-center text-xs text-slate-400">
        <span>Ops Ledger &bull; Secure Enterprise Portal</span>
      </footer>
    </div>
  );
}
