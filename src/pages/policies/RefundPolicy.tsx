import { RefreshCcw } from 'lucide-react';
import PolicyLayout from '../../components/policylayout';

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund Policy" icon={<RefreshCcw className="text-purple-600" size={28} />}>
      <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl">
        <h3 className="text-purple-900 font-bold mb-2 uppercase tracking-tight">7-Day Replacement</h3>
        <p>If your item arrives damaged or faulty, we offer a hassle-free 7-day replacement guarantee from the date of delivery.</p>
      </div>
      <section>
        <h3 className="text-slate-900 font-bold mb-2 uppercase tracking-tight">Conditions</h3>
        <p>Items must be in original, unopened packaging with all tags attached. Returns for "change of mind" are not supported for electronics.</p>
      </section>
    </PolicyLayout>
  );
}