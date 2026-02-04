import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Updated to match your specific categories
  const collections = [
    { name: 'All Products', id: 'all' },
    { name: 'Cases', id: 'cases' },
    { name: 'Smart Watches', id: 'smart-watches' },
    { name: 'Air Pods', id: 'air-pods' },
    { name: 'Headphones', id: 'headphones' },
    { name: 'Wireless Chargers', id: 'wireless-chargers' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid: Centered on mobile, 4 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">
          
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h3 className="text-2xl font-black text-white italic tracking-tighter">
              APEX<span className="text-purple-500">STORE</span>
            </h3>
            <p className="text-sm leading-relaxed max-w-xs text-slate-400">
              Elevating your lifestyle through premium design and cutting-edge technology. Experience the future of retail today.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-purple-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-purple-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-purple-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-purple-500 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Collections Column - UPDATED WITH YOUR CATEGORIES */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 text-purple-500">
              Our Collections
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {collections.map((item) => (
                <li key={item.id}>
                  <Link 
                    to={`/category/${item.id}`}
                    className="text-slate-400 hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-purple-500 mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support - UPDATED WITH LINKS TO POLICY PAGES */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 text-purple-500">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/shipping-policy" className="text-slate-400 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-slate-400 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 text-purple-500">Get In Touch</h4>
            <ul className="space-y-4 text-sm w-full font-medium">
              <li className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
                <Mail size={16} className="text-purple-500 shrink-0" />
                <span>support@apexstore.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-slate-400">
                <Phone size={16} className="text-purple-500 shrink-0" />
                <span>+92 323 6230800</span>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-3 text-slate-400">
                <MapPin size={16} className="text-purple-500 mt-1 shrink-0" />
                <span className="max-w-[200px] md:max-w-none text-xs">Mobile4You, Ram Talai Road, Gujrat, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-500">
          <p>© {currentYear} APEX STORE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}