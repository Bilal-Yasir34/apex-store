import { Truck } from 'lucide-react';
import PolicyLayout from '../../components/policylayout';

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping Policy" icon={<Truck className="text-purple-600" size={28} />}>
      <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="text-slate-900 font-bold mb-2 uppercase tracking-tight">Delivery Timeline</h3>
        <p>Orders are processed within 24-48 business hours. Standard delivery typically arrives within 3-5 business days across Pakistan.</p>
      </section>
      <section>
        <h3 className="text-slate-900 font-bold mb-2 uppercase tracking-tight">Shipping Rates</h3>
        <p>We offer Flat Rate shipping for all orders. Specific rates are calculated at checkout based on your region.</p>
      </section>
    </PolicyLayout>
  );
}