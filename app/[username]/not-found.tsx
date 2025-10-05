import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Portfolio Not Found</h2>
        <p className="text-gray-600 mb-8">
          This portfolio doesn't exist or hasn't been published yet.
        </p>
        <Link href="/">
          <Button size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}