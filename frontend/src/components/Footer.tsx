import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 dark:bg-black dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tighter text-black dark:text-white">Zyra</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for premium products. We believe in quality, sustainability, and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-6">Customer Service</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/faq" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors dark:text-gray-400">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 shrink-0" />
                <span>123 Commerce St, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 shrink-0" />
                <span>support@zyra.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Zyra. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500 dark:text-gray-500">
            <Link to="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
