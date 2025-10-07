import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NewsDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Tin tức #{id}</h1>
          <p className="text-muted-foreground mt-2">Đang phát triển...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
