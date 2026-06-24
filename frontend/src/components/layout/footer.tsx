import Link from 'next/link';
import { Anchor, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Anchor className="w-6 h-6 text-godavari-400" />
              <span className="font-bold text-lg">Papikondalu Tourism</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the majestic beauty of the Godavari river and Papikondalu hills with our premium boat tours and adventure packages.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-godavari-500 transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-godavari-500 transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-godavari-500 transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['About', '/about'], ['Packages', '/packages'], ['Gallery', '/gallery'], ['Reviews', '/reviews'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-gray-400 hover:text-godavari-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              {[['Privacy Policy', '/privacy-policy'], ['Terms & Conditions', '/terms'], ['FAQ', '/faq']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-gray-400 hover:text-godavari-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-godavari-400 shrink-0" />
                <span>Boat Ghat, Rajahmundry, Andhra Pradesh 533101</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-godavari-400" />
                <a href="tel:+919876543210" className="hover:text-godavari-400">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-godavari-400" />
                <a href="mailto:info@papikondalu.com" className="hover:text-godavari-400">info@papikondalu.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Papikondalu Tourism. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Made with ❤️ in Rajahmundry, Andhra Pradesh</p>
        </div>
      </div>
    </footer>
  );
}
