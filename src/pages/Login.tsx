import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

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
      // Force refresh ensures the Guard reads the fresh LocalStorage session
      window.location.href = '/admin';
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-purple-600 rounded-2xl mb-4 text-white"><Lock /></div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">APEX <span className="text-purple-600">Admin</span></h2>
        </div>
        {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold">{errorMsg}</div>}
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-purple-500" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-purple-500" value={password} onChange={e => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-purple-600 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Secure Login'}
          </button>
        </div>
      </form>
    </div>
  );
}