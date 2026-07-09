'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Car as CarIcon } from 'lucide-react';

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (location) query.set('location', location);
    if (category) query.set('category', category);
    router.push(`/cars?${query.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-5 items-end max-w-4xl"
    >
      <div className="space-y-2">
        <label className="text-xs font-semibold text-indigo-200 uppercase tracking-wider block">
          Pickup Location
        </label>
        <div className="relative group">
          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="City, airport, or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-indigo-200 uppercase tracking-wider block">
          Car Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all appearance-none h-[50px]"
        >
          <option value="" className="bg-slate-900">All Categories</option>
          <option value="economy" className="bg-slate-900">Economy</option>
          <option value="standard" className="bg-slate-900">Standard</option>
          <option value="premium" className="bg-slate-900">Premium</option>
          <option value="suv" className="bg-slate-900">SUV</option>
          <option value="luxury" className="bg-slate-900">Luxury</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 h-[50px] group"
      >
        <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
        <span>Search Fleet</span>
      </button>
    </form>
  );
}
