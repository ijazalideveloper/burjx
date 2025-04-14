import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MarketsLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-400">Loading market data...</p>
    </div>
  );
}