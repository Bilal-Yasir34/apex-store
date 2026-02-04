import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}

export default function PolicyLayout({ children, title, icon }: Props) {
  // Always scroll to top when a policy page is opened
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-all mb-12 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Boutique</span>
        </Link>

        <div className="relative">
          {/* Subtle Soft Glow for Light Theme */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200/50 blur-[120px] pointer-events-none" />
          
          <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                {icon}
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                  {title.split(' ')[0]} <span className="text-purple-600">{title.split(' ')[1]}</span>
                </h1>
                <div className="h-1 w-12 bg-purple-600 mt-2 rounded-full" />
              </div>
            </div>

            <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
              {children}
            </div>

            {/* Bottom timestamp */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span>© {new Date().getFullYear()} APEX STORE</span>
              <span>Last Updated: Feb 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}