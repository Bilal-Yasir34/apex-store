import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else if (data.session) {
      // Direct redirect to the Skoon Admin Dashboard
      window.location.href = '/admin';
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFB] px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-sm mb-6 relative">
            <ShieldCheck className="text-[#D4AF37]" size={28} strokeWidth={1.5} />
            <Sparkles className="absolute -top-2 -right-2 text-[#D4AF37]/40" size={16} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Skoon<span className="text-[#D4AF37] not-italic">.</span>
          </h2>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Administrative Portal
          </p>
        </div>

        <form 
          onSubmit={handleLogin} 
          className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 space-y-6"
        >
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[11px] font-bold flex items-center gap-3 animate-shake">
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Credential Email</label>
              <input 
                type="email" 
                placeholder="admin@Skoon.com" 
                className="w-full p-4 bg-[#FDFCFB] border border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm font-bold text-slate-900" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-4 bg-[#FDFCFB] border border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all text-sm font-bold text-slate-900" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
              />
            </div>

            <button 
              disabled={loading} 
              className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-[#D4AF37] transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Authorize Access
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Authorized Personnel Only • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}