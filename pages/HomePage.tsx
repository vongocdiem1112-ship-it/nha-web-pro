import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PropertyGrid from '@/components/PropertyGrid';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';

type PropertyType = 'nha' | 'dat' | 'chung_cu' | 'cho_thue' | undefined;

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<PropertyType>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: listingsData, isLoading } = trpc.listings.getAll.useQuery({
    type: selectedType,
    limit: 12,
    offset: 0,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero onSearch={setSearchQuery} />
      
      <main className="flex-1 bg-muted/30">
        {/* Filter Chips */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                { label: 'Tất cả', value: undefined },
                { label: 'Nhà', value: 'nha' as const },
                { label: 'Đất', value: 'dat' as const },
                { label: 'Chung cư', value: 'chung_cu' as const },
                { label: 'Cho thuê', value: 'cho_thue' as const },
              ].map((type) => (
                <button
                  key={type.label}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedType === type.value
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-foreground border border-border hover:border-primary'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <PropertyGrid 
              listings={listingsData?.items || []} 
              isLoading={isLoading} 
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
