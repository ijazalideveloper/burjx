import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to markets page
  redirect('/markets');
  
  // This will never be rendered
  return null;
}