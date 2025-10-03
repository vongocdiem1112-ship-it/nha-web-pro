import { SearchBar } from "./SearchBar";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center gradient-hero">
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Tìm ngôi nhà <span className="text-primary">hoàn hảo</span> của bạn
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Hàng ngàn tin đăng bất động sản uy tín, cập nhật liên tục
          </p>
        </div>
        <SearchBar />
      </div>
    </section>
  );
};
