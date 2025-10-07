import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="text-xl text-muted-foreground mt-4">Không tìm thấy trang</p>
          <Link to="/" className="inline-block mt-6 btn-primary">
            Về trang chủ
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
