import { ShieldCheck } from 'lucide-react';
import PolicyLayout from '../../components/policylayout';

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" icon={<ShieldCheck className="text-purple-600" size={28} />}>
      <section>
        <h3 className="text-slate-900 font-bold mb-2 uppercase tracking-tight">Data Security</h3>
        <p>We use SSL encryption to ensure your personal data and payment information are processed with the highest level of security.</p>
      </section>
      <section>
        <h3 className="text-slate-900 font-bold mb-2 uppercase tracking-tight">Information Use</h3>
        <p>We only collect information necessary for order fulfillment and improving your shopping experience. We never sell your data.</p>
      </section>
    </PolicyLayout>
  );
}