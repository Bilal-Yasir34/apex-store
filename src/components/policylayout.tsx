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
    <div className="min-h-screen bg-[#FCFAF7] text-slate-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#D4AF37] transition-all mb-12 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Boutique</span>
        </Link>

        <div className="relative">
          {/* Subtle Golden Glow - matching the Hero aesthetic */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#D4AF37]/10 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="relative bg-white border border-amber-100 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-amber-900/5">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
              <div className="w-fit p-5 bg-[#FCFAF7] rounded-3xl border border-amber-100 shadow-sm text-[#D4AF37]">
                {icon}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
                  {title.split(' ')[0]} <span className="text-[#D4AF37]">{title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <div className="h-[2px] w-16 bg-[#D4AF37] mt-4" />
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8 text-slate-600 leading-relaxed font-medium font-serif italic text-lg">
              {children}
            </div>

            {/* Bottom timestamp & Branding */}
            <div className="mt-20 pt-10 border-t border-amber-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-4 h-[1px] bg-amber-200"></span>
                <span>© {new Date().getFullYear()} SKOON TEXTILES</span>
              </div>
              <span className="text-[#D4AF37]/60">Last Updated: February 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}