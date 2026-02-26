import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#d4bb6e] text-slate-900 border-t border-[#B8962E]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Identity */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              Skoon<span className="text-white not-italic">.</span>
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-80">
              Premium UK Textiles. Crafting comfort and elegance for the modern home. 
              Designed in London, inspired by tranquility.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Collections</h3>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest">
              <li><Link to="/category/bedsheets_category" className="hover:text-white transition-colors">Bedsheets</Link></li>
              <li><Link to="/category/quilts_category" className="hover:text-white transition-colors">Quilts & Blankets</Link></li>
              <li><Link to="/category/cushions_category" className="hover:text-white transition-colors">Cushions</Link></li>
              <li><Link to="/category/floor_rugs_category" className="hover:text-white transition-colors">Floor Rugs</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Support</h3>
            <ul className="space-y-3 text-[11px] font-bold uppercase tracking-widest">
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Contact</h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="shrink-0" />
                <span>London, United Kingdom</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" />
                <span>+44 20 7946 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <span>hello@Skoon.co.uk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
            © 2026 Skoon UK. All Rights Reserved.
          </p>
          <div className="flex gap-6 opacity-60">
            {/* You can add payment icons here later */}
            <span className="text-[9px] font-black uppercase tracking-widest italic">Visa</span>
            <span className="text-[9px] font-black uppercase tracking-widest italic">Mastercard</span>
            <span className="text-[9px] font-black uppercase tracking-widest italic">Amex</span>
          </div>
        </div>
      </div>
    </footer>
  );
}