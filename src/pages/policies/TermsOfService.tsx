import { FileText } from 'lucide-react';
import PolicyLayout from '../../components/policylayout';

export default function TermsOfService() {
  return (
    <PolicyLayout title="Terms Of Service" icon={<FileText className="text-purple-600" size={28} />}>
      <section>
        <h3 className="text-slate-900 font-bold mb-2 uppercase tracking-tight">Usage Terms</h3>
        <p>By using APEX STORE, you agree to provide accurate information and comply with our site policies regarding purchases and conduct.</p>
      </section>
      <section>
        <h3 className="text-slate-900 font-bold mb-2 uppercase tracking-tight">Intellectual Property</h3>
        <p>All content, branding, and designs on this site are the property of APEX STORE and may not be used without written consent.</p>
      </section>
    </PolicyLayout>
  );
}