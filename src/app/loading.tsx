import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-64">
      <LoadingSpinner size="lg" />
    </div>
  );
}
