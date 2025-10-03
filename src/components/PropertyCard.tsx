import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-react";

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  type: string;
}

export const PropertyCard = ({
  image,
  title,
  price,
  location,
  beds,
  baths,
  area,
  type,
}: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-smooth cursor-pointer group">
      <div className="relative overflow-hidden h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
          {type}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{beds} PN</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{baths} WC</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{area} m²</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-accent">{price}</div>
      </CardContent>
    </Card>
  );
};
