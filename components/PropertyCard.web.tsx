import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

interface PropertyCardProps {
  listing: {
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
  };
}

const formatPrice = (price: number) => {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} tỷ`;
  }
  return `${(price / 1000000).toFixed(0)} triệu`;
};

const formatArea = (area: number) => {
  return `${area}m²`;
};

export default function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={listing.images[0] || '/placeholder-property.jpg'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          {listing.is_hot && (
            <div className="absolute top-3 left-3 bg-error text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              HOT
            </div>
          )}
          <button className="absolute top-3 right-3 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors">
            <Heart className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-lg font-bold text-primary mb-2">
            {formatPrice(listing.price)}
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
            <span className="font-semibold">{formatArea(listing.area)}</span>
            <span>•</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{listing.address}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
