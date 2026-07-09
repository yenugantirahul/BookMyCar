import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] px-4 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-6xl font-extrabold text-blue-600 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>
      </div>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg text-sm shadow transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
}
