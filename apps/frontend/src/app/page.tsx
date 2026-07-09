import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Car as CarIcon, MapPin, Cog, Fuel, Users } from 'lucide-react';
import { getCars } from '@/lib/api';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { HeroSearch } from '@/components/home/hero-search';

/* ------------------------------------------------------------------ *
 *  Editorial-automotive design. Server Component — no framer-motion,  *
 *  so no client JS is added here. The only entrance animation is a    *
 *  CSS keyframe (respects prefers-reduced-motion); everything else    *
 *  is hover-only.                                                     *
 *                                                                     *
 *  paper #F7F6F2 · ink #141417 · graphite #57575E                     *
 *  hairline #E4E1D9 · signal #C1401A                                  *
 * ------------------------------------------------------------------ */

const categories = [
  { id: 'economy',  label: 'Economy',  note: 'Efficient, easy, everyday' },
  { id: 'standard', label: 'Standard', note: 'Reliable all-rounders'     },
  { id: 'premium',  label: 'Premium',  note: 'A step above'              },
  { id: 'suv',      label: 'SUV',      note: 'Room to spare'             },
  { id: 'luxury',   label: 'Luxury',   note: 'The full occasion'         },
];

export default async function HomePage() {
  // Fetched on the server at render time — no loading state, no waterfall.
  const res = await getCars({ limit: 3, isAvailable: true });
  const featuredCars = res.success ? res.data : [];

  return (
    <div className="bg-[#F7F6F2] text-[#141417]">
      {/* One CSS entrance animation for the whole page. No JS. */}
      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-rise  { animation: heroRise 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-rise-2{ animation: heroRise 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise, .hero-rise-2 { animation: none; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <div className="hero-rise">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C1401A]" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#57575E]">
              Rent by the day
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl md:text-7xl">
            The right car for
            <br className="hidden sm:block" />{' '}
            <span className="font-serif font-normal italic text-[#C1401A]">wherever</span>{' '}
            you&apos;re headed.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#57575E] sm:text-lg">
            A hand-checked fleet, honest daily pricing, and pickup that starts
            where your trip does. No surprises at the counter.
          </p>
        </div>

        {/* Interactive search — the only client component on the page */}
       
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="border-t border-[#E4E1D9] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8A8A90]">The fleet</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Browse by category</h2>
          </div>

          <div className="grid grid-cols-1 divide-y divide-[#E4E1D9] border-y border-[#E4E1D9] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:border-x">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/cars?category=${cat.id}`}
                className="group relative flex flex-col justify-between px-5 py-6 transition-colors hover:bg-[#F7F6F2] focus:outline-none focus-visible:bg-[#F7F6F2] sm:border-[#E4E1D9] sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0"
              >
                <div className="flex items-start justify-between">
                  <span className="text-lg font-semibold tracking-tight">{cat.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-[#B7B4AC] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C1401A]" />
                </div>
                <span className="mt-6 text-sm text-[#57575E]">{cat.note}</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C1401A] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8A8A90]">Available now</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Ready to book</h2>
          </div>
          <Link
            href="/cars"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#141417] transition-colors hover:text-[#C1401A]"
          >
            <span>View all</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {featuredCars.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E4E1D9] bg-white px-6 py-24 text-center text-[#57575E]">
            No cars are free to book right now. Check the full fleet for upcoming availability.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#E4E1D9] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D6D2C8] hover:shadow-[0_24px_50px_-30px_rgba(20,20,23,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141417]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFEDE7]">
                  {car.primaryImageUrl ? (
                    <Image
                      src={car.primaryImageUrl}
                      alt={`${car.make} ${car.model}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <CarIcon className="h-10 w-10 text-[#C9C5BB]" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-[#141417] shadow-sm backdrop-blur-sm">
                    {getCategoryLabel(car.category)}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">{car.make} {car.model}</h3>
                    <span className="text-sm text-[#8A8A90]">{car.year}</span>
                  </div>

                  {/* Spec row — icons, not emoji */}
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-[#57575E]">
                    <span className="flex items-center gap-2"><Cog className="h-4 w-4 text-[#B7B4AC]" />{car.transmission}</span>
                    <span className="flex items-center gap-2"><Fuel className="h-4 w-4 text-[#B7B4AC]" />{car.fuelType}</span>
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#B7B4AC]" />{car.seats} seats</span>
                    <span className="flex items-center gap-2 truncate"><MapPin className="h-4 w-4 shrink-0 text-[#B7B4AC]" /><span className="truncate">{car.location}</span></span>
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-6 flex items-end justify-between border-t border-[#EFEDE7] pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold tracking-tight text-[#C1401A]">{formatCurrency(car.pricePerDay)}</span>
                      <span className="text-sm text-[#8A8A90]">/ day</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#141417] transition-colors group-hover:text-[#C1401A]">
                      Book
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#141417] px-8 py-12 text-white sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready when you are.</h2>
            <p className="mt-2 max-w-md text-[#A6A6AD]">
              Pick a car, pick your dates, and you&apos;re on the road. Free cancellation up to 24 hours before pickup.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#141417] transition-colors hover:bg-[#F7F6F2] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#141417]"
          >
            Browse the fleet
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}