import { Link } from 'react-router-dom';
import { Search, Heart, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">VT</span>
            </div>
            <span className="font-bold text-xl text-foreground">VungTauLand</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Trang chủ
            </Link>
            <Link to="/search" className="text-foreground hover:text-primary font-medium transition-colors">
              Tìm kiếm
            </Link>
            <Link to="/news" className="text-foreground hover:text-primary font-medium transition-colors">
              Tin tức
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/search" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link to="/favorites" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link to="/auth" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <User className="w-5 h-5 text-muted-foreground" />
            </Link>
            
            <button 
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-foreground hover:text-primary font-medium">
                Trang chủ
              </Link>
              <Link to="/search" className="text-foreground hover:text-primary font-medium">
                Tìm kiếm
              </Link>
              <Link to="/news" className="text-foreground hover:text-primary font-medium">
                Tin tức
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
