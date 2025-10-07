import PropertyCard from './PropertyCard.web';
import PropertyCardSkeleton from './PropertyCardSkeleton.web';

interface Listing {
  id: string;
  title: string;
  price: number;
  area: number;
  address: string;
  images: string[];
  type: 'nha' | 'dat' | 'chung_cu' | 'cho_thue';
  bedrooms?: number | null;
  bathrooms?: number | null;
  is_hot: boolean;
}

interface PropertyGridProps {
  listings: Listing[];
  isLoading: boolean;
}

export default function PropertyGrid({ listings, isLoading }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">Không tìm thấy bất động sản nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <PropertyCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
