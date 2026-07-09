import Link from 'next/link';
import { Car } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-white text-gray-600">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600">
              <Car className="h-6 w-6" />
              <span>CarRental</span>
            </Link>
            <p className="text-sm">
              Premium vehicles. Flexible booking options. Best in class safety & customer service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="hover:text-blue-600 transition-colors">All Cars</Link></li>
              <li><Link href="/cars?category=luxury" className="hover:text-blue-600 transition-colors">Luxury</Link></li>
              <li><Link href="/cars?category=suv" className="hover:text-blue-600 transition-colors">SUVs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} CarRental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
