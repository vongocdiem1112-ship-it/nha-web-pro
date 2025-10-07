import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
      onSearch(searchInput);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Tìm ngôi nhà mơ ước của bạn tại{' '}
            <span className="text-gradient-primary">Vũng Tàu</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Khám phá hàng nghìn bất động sản uy tín, giá tốt nhất thị trường
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm theo địa chỉ, quận, loại nhà..."
              className="w-full px-6 py-4 pr-14 rounded-full border-2 border-border focus:border-primary focus:outline-none shadow-lg text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-primary-hover transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">Bất động sản</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Môi giới</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Quận/Huyện</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
