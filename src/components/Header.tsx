import { Home, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Home className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Nhà Đất</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
              Mua bán
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
              Cho thuê
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
              Dự án
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
              Tin tức
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-smooth hidden md:inline-flex">
              Đăng tin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
