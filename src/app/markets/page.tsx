import ClientOnly from '@/components/ClientOnly';
import MarketsContent from './MarketsContent';

export default function MarketsPage() {
  return (
    <ClientOnly>
      <MarketsContent />
    </ClientOnly>
  );
}